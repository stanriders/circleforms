using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Contracts.Validation;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Posts.Questions.Submissions;
using CircleForms.Database.Services.Abstract;
using CircleForms.Database.Services.Extensions;
using Mapster;
using MongoDB.Entities;

namespace CircleForms.ModelLayer.Answers;

public class AnswerService : IAnswerService
{
    private readonly ICacheRepository _cache;
    private readonly IGamemodeService _gamemodeService;
    private readonly IPostRepository _postRepository;
    private readonly IAnswerRepository _answerRepository;

    public AnswerService(IPostRepository postRepository, IAnswerRepository answerRepository, ICacheRepository cache, IGamemodeService gamemodeService)
    {
        _postRepository = postRepository;
        _answerRepository = answerRepository;
        _cache = cache;
        _gamemodeService = gamemodeService;
    }

    public async Task<Result<List<Answer>>> GetAnswers(string claim, string id)
    {
        var answersTask = _answerRepository.GetPostAnswers(id);
        var post = await _postRepository.Get(id, x => new Post
        {
            AuthorRelation = x.AuthorRelation
        });

        if (post is null)
        {
            return Result<List<Answer>>.NotFound(id);
        }

        if (post.AuthorId != claim)
        {
            return Result<List<Answer>>.Forbidden();
        }

        return new Result<List<Answer>>(await answersTask);
    }

    public async Task<Maybe<Error>> DeleteAnswer(string claim, string postId)
    {
        var post = await _postRepository.Get(postId);
        if (!post.AllowAnswerEdit)
        {
            return Maybe<Error>.Some(new Error("You can't delete your answer", HttpStatusCode.Forbidden));
        }

        var answer = post.Answers.FirstOrDefault(x => x.UserRelation.ID == claim);
        if (answer is null)
        {
            return Maybe<Error>.Some(new Error($"Answer for user {claim} is not found", HttpStatusCode.NotFound));
        }

        await _cache.DecrementAnswers(postId);
        await answer.DeleteAsync();
        return Maybe<Error>.None();
    }

    public async Task<Maybe<Error>> Answer(string user, string id, IEnumerable<SubmissionContract> answerContracts)
    {
        var post = await _postRepository.Get(id);

        if (post is null)
        {
            return Maybe<Error>.Some(new Error("Could not find post with this id", HttpStatusCode.BadRequest));
        }

        if (!post.IsActive)
        {
            return Maybe<Error>.Some(new Error("The post is inactive or unpublished", HttpStatusCode.BadRequest));
        }

        var repeatedAnswer = post.Answers.FirstOrDefault(x => x.UserRelation.ID == user);
        if (repeatedAnswer is not null && !post.AllowAnswerEdit)
        {
            return Maybe<Error>.Some(new Error("You already voted", HttpStatusCode.Conflict));
        }

        var limitationsResult = await ProcessLimitations(post, user);
        if (!limitationsResult.IsNone)
        {
            return limitationsResult;
        }

        var result = await ProcessAnswer(post, answerContracts);
        if (result.IsError)
        {
            return Maybe<Error>.Some(result.Errors);
        }

        if (repeatedAnswer is null)
        {
            await _answerRepository.Add(post.ID, result.Value, user);
            await _cache.IncrementAnswers(post.ID);
        }
        else
        {
            await _answerRepository.Update(post.ID, repeatedAnswer.ID, result.Value, user);
        }

        return Maybe<Error>.None();
    }

    private async Task<Result<List<Submission>>> ProcessAnswer(Post post,
        IEnumerable<SubmissionContract> answers)
    {
        var questions = post.Questions.ToDictionary(x => x.Id);
        var required = post.Questions.Where(x => !x.Optional).Select(x => x.Id).ToHashSet();
        var validationErrors = new List<ErrorData>();

        foreach (var answer in answers)
        {
            if (!questions.ContainsKey(answer.QuestionId))
            {
                return Result<List<Submission>>.Error($"Question with id {answer.QuestionId} is not found");
            }

            var question = questions[answer.QuestionId];

            var validator = new SubmissionContractValidator();
            var validationResult = await validator.ValidateAsync((question, answer));
            if (!validationResult.IsValid)
            {
                foreach (var error in validationResult.Errors)
                {
                    validationErrors.Add(new ErrorData
                    {
                        Source = answer.QuestionId,
                        Message = error.ToString()
                    });
                }
            }

            required.Remove(answer.QuestionId);
        }

        if (required.Count != 0)
        {
            return Result<List<Submission>>.Error($"Following required questions are not filled: {string.Join(", ", required)}");
        }

        if (validationErrors.Count != 0)
        {
            return Result<List<Submission>>.Error(validationErrors.ToArray());
        }

        return new Result<List<Submission>>(answers.Adapt<List<Submission>>());
    }

    private async Task<Maybe<Error>> ProcessLimitations(Post post, string userId)
    {
        var gamemode = post.Gamemode;
        if (gamemode is Gamemode.None)
        {
            return Maybe<Error>.None();
        }

        var statistics = await _gamemodeService.GetStatistics(userId, gamemode);
        if (statistics.IsError)
        {
            return Maybe<Error>.Some(statistics.Errors);
        }

        if (post.Limitations is null)
        {
            return Maybe<Error>.None();
        }

        var pp = (int) Math.Round(statistics.Value.Pp);
        var rank = statistics.Value.GlobalRank;

        if (post.Limitations.Pp is not null && !pp.IsInRange(post.Limitations.Pp))
        {
            return Maybe<Error>.Some(new Error("Your pp is not in the allowed range of this post!", HttpStatusCode.Conflict));
        }

        if (post.Limitations.Rank is not null && !rank.IsInRange(post.Limitations.Rank))
        {
            return Maybe<Error>.Some(new Error("Your rank is not in the allowed range of this post!", HttpStatusCode.Conflict));
        }

        return Maybe<Error>.None();
    }
}
