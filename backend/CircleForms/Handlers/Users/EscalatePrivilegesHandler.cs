using System.Threading;
using System.Threading.Tasks;
using CircleForms.Commands;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers.Users;

public class EscalatePrivilegesHandler : IRequestHandler<EscalatePrivilegesCommand, User>
{
    private readonly IUserRepository _repository;

    public EscalatePrivilegesHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<User> Handle(EscalatePrivilegesCommand request, CancellationToken cancellationToken)
    {
        var user = await _repository.Get(request.Id);
        if (user is null)
        {
            return null;
        }

        user.Roles = request.Role;
        await _repository.Update(user.ID, user);

        return user;
    }
}
