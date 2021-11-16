using System.Collections.Generic;
using System.Threading.Tasks;

namespace CircleForms.Services.Database.Interfaces
{
    public interface IRepository<T>
    {
        Task<List<T>> Get();
        Task<T> Get(long id);
        Task<T> Create(T post);
        Task Update(long id, T post);
        Task Remove(T post);
        Task Remove(long id);
    }
}
