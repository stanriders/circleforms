using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Models.Posts;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace CircleForms.Services.Database;

public class UserRepository : IUserRepository
{
    private readonly ILogger<UserRepository> _logger;
    private readonly IMongoCollection<User> _users;

    public UserRepository(ILogger<UserRepository> logger, IMongoDatabase database)
    {
        _logger = logger;
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
        _logger.LogInformation("Creating a new user {@User}", user);

        user.Posts = new List<Post>();
        await _users.InsertOneAsync(user);

        return user;
    }

    public async Task Update(long id, User user)
    {
        _logger.LogInformation("Updating user {Id} with {@User}", id, user);

        await _users.ReplaceOneAsync(x => x.Id == id, user);
    }

    public async Task Remove(User user)
    {
        _logger.LogWarning("Removing user {@User}", user);
        await _users.DeleteOneAsync(x => x.Id == user.Id);
    }

    public async Task Remove(long id)
    {
        _logger.LogWarning("Removing user {User}", id);

        await _users.DeleteOneAsync(x => x.Id == id);
    }
}
