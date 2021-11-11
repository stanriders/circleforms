
using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models;

namespace CircleForms.Services.Database.Interfaces
{
    public interface IUserDatabaseService
    {
        Task<List<User>> Get();
        Task<User> Get(long id);
        Task<User> Create(User user);
        Task Update(long id, User user);
        Task Remove(User user);
        Task Remove(long id);
    }
}
