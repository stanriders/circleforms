
using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace CircleForms.Services.Database
{
    public class UserDatabaseService : IUserDatabaseService
    {
        private readonly IMongoCollection<User> _users;

        public UserDatabaseService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Database"));
            var database = client.GetDatabase("circleforms");

            _users = database.GetCollection<User>("Users");
        }

        public Task<List<User>> Get()
        {
            return _users.Find(x => true).ToListAsync();
        }

        public Task<User> Get(long id)
        {
            return _users.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User> Create(User user)
        {
            await _users.InsertOneAsync(user);
            return user;
        }

        public Task Update(long id, User user)
        {
            return _users.ReplaceOneAsync(x => x.Id == id, user);
        }

        public Task Remove(User user)
        {
            return _users.DeleteOneAsync(x => x.Id == user.Id);
        }

        public Task Remove(long id)
        {
            return _users.DeleteOneAsync(x => x.Id == id);
        }
    }
}
