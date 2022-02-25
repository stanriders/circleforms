using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Queries;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers.Users;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<User>>
{
    private readonly IUserRepository _repository;

    public GetAllUsersHandler(IUserRepository repository)
    {
        _repository = repository;
    }
    public Task<List<User>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        return _repository.Get();
    }
}
