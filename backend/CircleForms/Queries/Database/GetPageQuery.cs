using System.Collections.Generic;
using CircleForms.Models.Posts;
using MediatR;

namespace CircleForms.Queries.Database;

public class GetPageQuery : IRequest<List<PostRedis>>
{
    public int Page { get; }

    public GetPageQuery(int page)
    {
        Page = page;
    }
}
