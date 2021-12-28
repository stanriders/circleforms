using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models;

namespace CircleForms.Services.Database.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> Get();
        Task<User> Get(long id);
        Task<User> Create(User user);
        Task<User> AddPost(long id, Post post);
        Task Update(long id, User user);
        Task Remove(User user);
        Task Remove(long id);
    }
}
