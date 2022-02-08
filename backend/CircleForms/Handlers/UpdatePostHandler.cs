using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Commands;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers;

public class UpdatePostHandler : IRequestHandler<UpdatePostCommand, CQRSResponse<Post>>
{
    private readonly IPostRepository _repository;
    private readonly IMapper _mapper;

    public UpdatePostHandler(IPostRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }
    public async Task<CQRSResponse<Post>> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        var post = await _repository.Get(request.Id);
        if (post.AuthorId != request.Claim)
        {
            return new CQRSResponse<Post>(401, "You are not authorized to do this action");
        }

        var questions = post.Questions;
        var updatedPost = _mapper.Map(request.Contract, post);
        if (request.Contract.Questions is not null)
        {
            foreach (var updatedPostQuestion in request.Contract.Questions)
            {
                if (updatedPostQuestion.Delete)
                {
                    var question = questions.FirstOrDefault(x => x.Id == updatedPostQuestion.Id);
                    if (question is null)
                    {
                        return new CQRSResponse<Post>(200, $"Question {updatedPostQuestion.Id} is not found");
                    }

                    questions.Remove(question);

                    continue;
                }

                var newQuestion = _mapper.Map<Question>(updatedPostQuestion);
                if (updatedPostQuestion.Id is null)
                {
                    var newPostId = questions.Max(x => x.Id) + 1;
                    newQuestion.Id = newPostId;
                    questions.Add(newQuestion);

                    continue;
                }

                var postToUpdate = questions.FirstOrDefault(x => x.Id == updatedPostQuestion.Id);
                if (postToUpdate is null)
                {
                    return new CQRSResponse<Post>(200, "Question {updatedPostQuestion.Id} is not found");
                }

                questions.Remove(postToUpdate);
                questions.Add(newQuestion);
            }
        }

        updatedPost.Questions = questions;

        await _repository.Update(post.ID, post, true);

        return new CQRSResponse<Post>(updatedPost);
    }
}
