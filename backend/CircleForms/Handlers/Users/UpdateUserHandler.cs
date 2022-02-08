using System.Threading;
using System.Threading.Tasks;
using CircleForms.Commands;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers.Users;

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, User>
{
    private readonly IUserRepository _repository;

    public UpdateUserHandler(IUserRepository repository)
    {
        _repository = repository;
    }
    public async Task<User> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        await _repository.Update(request.Id, request.User);

        return request.User;
    }
}
