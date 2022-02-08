using CircleForms.Models;
using MediatR;

namespace CircleForms.Commands;

public class CreateUserCommand : IRequest<User>
{
    public User User { get; }

    public CreateUserCommand(User user)
    {
        User = user;
    }
}
