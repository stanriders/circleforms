using System.Threading;
using System.Threading.Tasks;
using CircleForms.Models.Posts;
using CircleForms.Queries;
using CircleForms.Queries.Cache;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers.Posts.Cache;

public class GetCachedPostHandler : IRequestHandler<GetCachedPostQuery, PostRedis>
{
    private readonly IPostRepository _repository;

    public GetCachedPostHandler(IPostRepository repository)
    {
        _repository = repository;
    }
    public Task<PostRedis> Handle(GetCachedPostQuery request, CancellationToken cancellationToken)
    {
        return _repository.GetCached(request.Id);
    }
}
