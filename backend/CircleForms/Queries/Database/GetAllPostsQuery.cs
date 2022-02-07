using System.Collections.Generic;
using CircleForms.Models.Posts;
using MediatR;

namespace CircleForms.Queries.Database;

public class GetAllPostsQuery : IRequest<List<Post>>
{
}
