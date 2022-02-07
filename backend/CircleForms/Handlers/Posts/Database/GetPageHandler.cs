using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CircleForms.Models.Posts;
using CircleForms.Queries;
using CircleForms.Queries.Database;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers.Posts.Database;

public class GetPageHandler : IRequestHandler<GetPageQuery, List<PostRedis>>
{
    private readonly IPostRepository _repository;

    public GetPageHandler(IPostRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<PostRedis>> Handle(GetPageQuery request, CancellationToken cancellationToken)
    {
        var posts = await _repository.GetCachedPage(request.Page);

        return posts.ToList();
    }
}
