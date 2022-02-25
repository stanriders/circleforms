using System.Threading;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Queries;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers.Users;

public class GetUserHandler : IRequestHandler<GetUserQuery, User>
{
    private readonly IUserRepository _repository;

    public GetUserHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public Task<User> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        return _repository.Get(request.Id);
    }
}
