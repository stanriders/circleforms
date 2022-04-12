using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Database.Models.Users;

namespace CircleForms.Database.Services.Abstract;

public interface IUserRepository
{
    Task<List<User>> Get();
    Task<User> Get(string id);
    Task<List<User>> Get(List<string> ids);
    Task<User> Create(User user);
    Task Update(string id, User user);
    Task Remove(User user);
}
