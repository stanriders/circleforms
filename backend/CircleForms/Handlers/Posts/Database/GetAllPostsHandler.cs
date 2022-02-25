using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CircleForms.Models.Posts;
using CircleForms.Queries;
using CircleForms.Queries.Database;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers.Posts.Database;

public class GetAllPostsHandler : IRequestHandler<GetAllPostsQuery, List<Post>>
{
    private readonly IPostRepository _postRepository;

    public GetAllPostsHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public Task<List<Post>> Handle(GetAllPostsQuery request, CancellationToken cancellationToken)
    {
        return _postRepository.Get();
    }
}
