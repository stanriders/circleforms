using CircleForms.Models.Posts;
using MediatR;

namespace CircleForms.Queries.Cache;

public class GetCachedPostQuery : IRequest<PostRedis>
{
    public string Id { get; }

    public GetCachedPostQuery(string id)
    {
        Id = id;
    }
}
