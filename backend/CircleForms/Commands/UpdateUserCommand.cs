using CircleForms.Models;
using MediatR;

namespace CircleForms.Commands;

public class UpdateUserCommand : IRequest<User>
{
    public string Id { get; }
    public User User { get; }

    public UpdateUserCommand(string id, User user)
    {
        Id = id;
        User = user;
    }
}
