using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models;

namespace CircleForms.Services.Interfaces
{
    public interface ISessionService
    {
        Task<long> Get(Guid guid);
        Task<bool> Add(Session session);
        Task<long> Remove(IEnumerable<Guid> guids);
    }
}
