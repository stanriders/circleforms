using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Questions;
using CircleForms.Database.Models.Posts.Questions.Submissions;
using CircleForms.Database.Services.Abstract;
using MapsterMapper;

namespace CircleForms.ModelLayer.Answers;

public class AnswerService : IAnswerService
{
    private readonly ICacheRepository _cache;
    private readonly IMapper _mapper;
    private readonly IPostRepository _postRepository;

    public AnswerService(IMapper mapper, IPostRepository postRepository, ICacheRepository cache)
    {
        _mapper = mapper;
        _postRepository = postRepository;
        _cache = cache;
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
}
