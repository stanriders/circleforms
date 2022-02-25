using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Commands;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using CircleForms.Models.Posts.Questions.Submissions;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers;

public class AddAnswerHandler : IRequestHandler<AddAnswerCommand, CQRSResponse<object>>
{
    private IPostRepository _postRepository;
    private IMapper _mapper;

    public AddAnswerHandler(IPostRepository postRepository, IMapper mapper)
    {
        _postRepository = postRepository;
        _mapper = mapper;
    }
    private (List<Submission> submissions, string error) ProcessAnswer(Post post,
            IEnumerable<SubmissionContract> answers)
    {
        var questions = post.Questions.ToDictionary(x => x.Id);
        var answersDictionary = answers.ToDictionary(x => x.QuestionId);

        //If any required fields doesn't filled
        if (post.Questions.Where(question => !question.Optional)
            .Any(question => !answersDictionary.ContainsKey(question.Id)))
        {
            return (null, "One or more required fields doesn't filled");
        }

        var resultingAnswers = new List<Submission>();
        foreach (var (key, value) in answersDictionary)
        {
            //If question with id doesn't exist or answer was not provided
            if (!questions.TryGetValue(key, out var question))
            {
                return (null, $"Question with id {key} does not exist");
            }

            if (question.QuestionType == QuestionType.Choice)
            {
                var choice = int.Parse(value.Answer);

                if (choice >= question.QuestionInfo.Count)
                {
                    return (null, $"Choice for {key} is not in the range of choice ids");
                }
            }

            var answer = _mapper.Map<Submission>(value);

            resultingAnswers.Add(answer);
        }

        return (resultingAnswers, null);
    }

    public async Task<CQRSResponse<object>> Handle(AddAnswerCommand request, CancellationToken cancellationToken)
    {
        var post = await _postRepository.Get(request.Id);

        if (post is null)
        {
            return new CQRSResponse<object>(400, "Could not find post with this id");
        }

        if (post.Answers.Any(x => x.ID == request.Claim))
        {
            return new CQRSResponse<object>(409, "You already voted");
        }

        var (submissions, error) = ProcessAnswer(post, request.AnswerContracts);

        if (submissions is null)
        {
            return new CQRSResponse<object>(400, error);
        }

        var answer = new Answer
        {
            Submissions = submissions,
            ID = request.Claim
        };

        await _postRepository.AddAnswer(post.ID, answer);

        return new CQRSResponse<object>(200);
    }
}
