using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Posts.Questions;
using CircleForms.Database.Models.Posts.Questions.Submissions;
using CircleForms.Database.Services.Abstract;
using MapsterMapper;

namespace CircleForms.ModelLayer.Answers;

public class AnswerService : IAnswerService
{
    private readonly ICacheRepository _cache;
    private readonly IGamemodeService _gamemodeService;
    private readonly IMapper _mapper;
    private readonly IPostRepository _postRepository;

    public AnswerService(IMapper mapper, IPostRepository postRepository, ICacheRepository cache, IGamemodeService gamemodeService)
    {
        _mapper = mapper;
        _postRepository = postRepository;
        _cache = cache;
        _gamemodeService = gamemodeService;
    }

    public async Task<Result> Answer(string user, string id, IEnumerable<SubmissionContract> answerContracts)
    {
        var post = await _postRepository.Get(id);

        if (post is null)
        {
            return new Result(HttpStatusCode.BadRequest, "Could not find post with this id");
        }

        if (!post.IsActive || !post.Published)
        {
            return new Result(HttpStatusCode.BadRequest, "The post is inactive or unpublished");
        }

        if (post.Answers.Any(x => x.UserRelation.ID == user))
        {
            return new Result(HttpStatusCode.Conflict, "You already voted");
        }

        var limitationsResult = await ProcessLimitations(post, user);
        if (limitationsResult.IsError)
        {
            return new Result(limitationsResult.StatusCode, limitationsResult.Message);
        }

        var result = ProcessAnswer(post, answerContracts);
        if (result.IsError)
        {
            return new Result(result.StatusCode, result.Message);
        }

        var submissions = result.Value;

        var answer = new Answer
        {
            Submissions = submissions,
            UserRelation = user
        };

        await _postRepository.AddAnswer(post, answer);
        await _cache.IncrementAnswers(post.ID);

        return new Result();
    }

    private Result<List<Submission>> ProcessAnswer(Post post,
        IEnumerable<SubmissionContract> answers)
    {
        var questions = post.Questions.ToDictionary(x => x.Id);
        var answersDictionary = answers.ToDictionary(x => x.QuestionId);

        //If any required fields doesn't filled
        if (post.Questions.Where(question => !question.Optional)
            .Any(question => !answersDictionary.ContainsKey(question.Id)))
        {
            return new Result<List<Submission>>("One or more required fields doesn't filled");
        }

        var resultingAnswers = new List<Submission>();
        foreach (var (key, value) in answersDictionary)
        {
            //If question with id doesn't exist or answer was not provided
            if (!questions.TryGetValue(key, out var question))
            {
                return new Result<List<Submission>>($"Question with id {key} does not exist");
            }

            if (question.QuestionType == QuestionType.Choice)
            {
                var choice = int.Parse(value.Answer);

                if (choice >= question.QuestionInfo.Count)
                {
                    return new Result<List<Submission>>($"Choice for {key} is not in the range of choice ids");
                }
            }

            var answer = _mapper.Map<Submission>(value);

            resultingAnswers.Add(answer);
        }

        return new Result<List<Submission>>(resultingAnswers);
    }

    private async Task<Result> ProcessLimitations(Post post, string userId)
    {
        var gamemode = post.Gamemode;
        if (gamemode is Gamemode.None)
        {
            return new Result();
        }

        var statistics = await _gamemodeService.GetStatistics(userId, gamemode);
        if (statistics.IsError)
        {
            return new Result(statistics.StatusCode, statistics.Message);
        }

        if (post.Limitations is not null)
        {
            if (post.Limitations.Pp is not null &&
                !post.Limitations.Pp.IsInRange((int) Math.Round(statistics.Value["Pp"].AsDouble)))
            {
                return new Result(HttpStatusCode.Conflict, "Your pp is not in the allowed range of this post!");
            }

            if (post.Limitations.Rank is not null &&
                !post.Limitations.Rank.IsInRange(statistics.Value["GlobalRank"].AsInt32))
            {
                return new Result(HttpStatusCode.Conflict, "Your rank is not in the allowed range of this post!");
            }
        }

        return new Result();
    }
}
