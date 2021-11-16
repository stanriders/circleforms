using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace CircleForms.Services.Database
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _users;

        public UserRepository(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Database"));
            var database = client.GetDatabase("circleforms");

            _users = database.GetCollection<User>("users");
        }

        public async Task<List<User>> Get()
        {
            return await (await _users.FindAsync(x => true)).ToListAsync();
        }

        public async Task<User> Get(long id)
        {
            return await (await _users.FindAsync(x => x.Id == id)).FirstOrDefaultAsync();
        }

        public async Task<User> Create(User user)
        {
            await _users.InsertOneAsync(user);

            return user;
        }

        public async Task Update(long id, User user)
        {
            await _users.ReplaceOneAsync(x => x.Id == id, user);
        }

        public async Task Remove(User user)
        {
            await _users.DeleteOneAsync(x => x.Id == user.Id);
        }

        public async Task Remove(long id)
        {
            await _users.DeleteOneAsync(x => x.Id == id);
        }
    }
}
