using CircleForms.Models;
using MediatR;

namespace CircleForms.Commands;

public class EscalatePrivilegesCommand : IRequest<User>
{
    public string Id { get; }
    public Roles Role { get; }

    public EscalatePrivilegesCommand(string id, Roles role)
    {
        Id = id;
        Role = role;
    }
}
