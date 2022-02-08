using System.Collections.Generic;
using CircleForms.Models;
using MediatR;

namespace CircleForms.Queries;

public class GetAllUsersQuery : IRequest<List<User>>
{
}
