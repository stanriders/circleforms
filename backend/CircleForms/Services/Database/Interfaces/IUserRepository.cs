using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Models.Users;

namespace CircleForms.Services.Database.Interfaces;

public interface IUserRepository
{
    Task<List<User>> Get();
    Task<User> Get(string id);
    Task<User> Create(User user);
    Task Update(string id, User user);
    Task Remove(User user);
    Task Remove(string id);
}
