using CircleForms.Models;
using MediatR;

namespace CircleForms.Queries;

public class GetUserQuery : IRequest<User>
{
    public string Id { get; }

    public GetUserQuery(string id)
    {
        Id = id;
    }
}
