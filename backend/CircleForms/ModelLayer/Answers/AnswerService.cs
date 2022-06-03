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

    public async Task<Error> Answer(string user, string id, IEnumerable<SubmissionContract> answerContracts)
    {
        var post = await _postRepository.Get(id);

        if (post is null)
        {
            return new Error(HttpStatusCode.BadRequest, "Could not find post with this id");
        }

        if (!post.IsActive)
        {
            return new Error(HttpStatusCode.BadRequest, "The post is inactive or unpublished");
        }

        var repeatedAnswer = post.Answers.FirstOrDefault(x => x.UserRelation.ID == user);
        if (repeatedAnswer is not null && !post.AllowAnswerEdit)
        {
            return new Error(HttpStatusCode.Conflict, "You already voted");
        }

        var limitationsResult = await ProcessLimitations(post, user);
        if (limitationsResult.IsError)
        {
            return limitationsResult;
        }

        var result = await ProcessAnswer(post, answerContracts);
        if (result.IsError)
        {
            return result.ToError();
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

        return new Error();
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
                return new Result<List<Submission>>($"Question with id {answer.QuestionId} is not found");
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
            return new Result<List<Submission>>(
                $"Following required questions are not filled: {string.Join(", ", required)}");
        }

        if (validationErrors.Count != 0)
        {
            return new Result<List<Submission>>(validationErrors.ToArray());
        }

        return new Result<List<Submission>>(answers.Adapt<List<Submission>>());
    }

    private async Task<Error> ProcessLimitations(Post post, string userId)
    {
        var gamemode = post.Gamemode;
        if (gamemode is Gamemode.None)
        {
            return new Error();
        }

        var statistics = await _gamemodeService.GetOrAddStatistics(userId, gamemode);
        if (statistics.IsError)
        {
            return new Error(statistics.StatusCode, statistics.Errors);
        }

        if (post.Limitations is null)
        {
            return new Error();
        }

        var pp = (int) Math.Round(statistics.Value["Pp"].AsDouble);
        var rank = statistics.Value["GlobalRank"].AsInt32;

        if (post.Limitations.Pp is not null && !pp.IsInRange(post.Limitations.Pp))
        {
            return new Error(HttpStatusCode.Conflict, "Your pp is not in the allowed range of this post!");
        }

        if (post.Limitations.Rank is not null && !rank.IsInRange(post.Limitations.Rank))
        {
            return new Error(HttpStatusCode.Conflict, "Your rank is not in the allowed range of this post!");
        }

        return new Error();
    }
}
