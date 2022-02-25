using System.Threading;
using System.Threading.Tasks;
using CircleForms.Commands;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers.Users;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, User>
{
    private readonly IUserRepository _repository;

    public CreateUserHandler(IUserRepository repository)
    {
        _repository = repository;
    }
    public Task<User> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        return _repository.Create(request.User);
    }
}
