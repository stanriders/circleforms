using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Services.Interfaces;
using StackExchange.Redis;

namespace CircleForms.Services
{
    public class SessionService : ISessionService
    {
        private readonly IConnectionMultiplexer _multiplexer;

        public SessionService(IConnectionMultiplexer multiplexer)
        {
            _multiplexer = multiplexer;
        }

        private IDatabase _db => _multiplexer.GetDatabase();

        public async Task<long> Get(Guid guid)
        {
            var vac = await _db.StringGetAsync(guid.ToString());
            if (vac.TryParse(out long val))
            {
                return val;
            }

            return -1;
        }

        public async Task<bool> Add(Session session)
        {
            return await _db.StringSetAsync(session.Guid.ToString(), session.Id);
        }

        public async Task<long> Remove(IEnumerable<Guid> guids)
        {
            var strs = guids.Select(x => x.ToString()).Cast<RedisKey>().ToArray();

            return await _db.KeyDeleteAsync(strs);
        }
    }
}
