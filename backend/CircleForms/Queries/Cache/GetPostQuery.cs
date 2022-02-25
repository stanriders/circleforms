using CircleForms.Models.Posts;
using MediatR;

namespace CircleForms.Queries.Cache;

public class GetPostQuery : IRequest<Post>
{
    public string Id { get; }

    public GetPostQuery(string id)
    {
        Id = id;
    }
}
