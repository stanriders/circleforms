using System.Collections.Generic;
using System.Threading.Tasks;

namespace CircleForms.Services.Database.Interfaces
{
    public interface IRepository<T>
    {
        Task<List<T>> Get();
        Task<T> Get(long id);
        Task<T> Create(T post);
        Task Update(long id, T item);
        Task Remove(T item);
        Task Remove(long id);
    }
}
