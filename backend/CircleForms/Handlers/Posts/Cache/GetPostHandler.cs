using System.Threading;
using System.Threading.Tasks;
using CircleForms.Models.Posts;
using CircleForms.Queries.Cache;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers.Posts.Cache;

public class GetPostHandler : IRequestHandler<GetPostQuery, Post>
{
    private readonly IPostRepository _repository;

    public GetPostHandler(IPostRepository repository)
    {
        _repository = repository;
    }
    public Task<Post> Handle(GetPostQuery request, CancellationToken cancellationToken)
    {
        return _repository.Get(request.Id);
    }
}
