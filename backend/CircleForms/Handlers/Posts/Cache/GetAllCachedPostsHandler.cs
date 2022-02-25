using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CircleForms.Models.Posts;
using CircleForms.Queries;
using CircleForms.Queries.Cache;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers.Posts.Cache;

public class GetAllCachedPostsHandler : IRequestHandler<GetAllCachedPostsQuery, List<PostRedis>>
{
    private readonly IPostRepository _repository;

    public GetAllCachedPostsHandler(IPostRepository repository)
    {
        _repository = repository;
    }
    public async Task<List<PostRedis>> Handle(GetAllCachedPostsQuery request, CancellationToken cancellationToken)
    {
        var post = await _repository.GetCached();

        return post.ToList();
    }
}
