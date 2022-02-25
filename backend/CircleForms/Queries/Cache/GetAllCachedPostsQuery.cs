using System.Collections.Generic;
using CircleForms.Models.Posts;
using MediatR;

namespace CircleForms.Queries.Cache;

public class GetAllCachedPostsQuery : IRequest<List<PostRedis>>
{
}
