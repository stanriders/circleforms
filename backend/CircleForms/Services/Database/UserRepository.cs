using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models.Posts;
using CircleForms.Models.Users;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Logging;
using MongoDB.Entities;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace CircleForms.Services.Database;

public class UserRepository : IUserRepository
{
    private readonly ILogger<UserRepository> _logger;
    private readonly IDatabase _redis;

    public UserRepository(ILogger<UserRepository> logger)
    {
        _logger = logger;
    }

    public async Task<List<User>> Get()
    {
        return await DB.Find<User>().ManyAsync(x => true);
    }

    public async Task<User> Get(string id)
    {
        return await DB.Find<User>().OneAsync(id);
    }

    public async Task<User> Create(User user)
    {
        _logger.LogInformation("Creating a new user {User}", user.ID);

        user.Posts = new List<Post>();
        await DB.InsertAsync(user);

        return user;
    }

    public async Task Update(string id, User user)
    {
        _logger.LogInformation("Updating user {Id}", id);
        _logger.LogDebug("Updating user {Id} to {@User}", id, user);

        var result = await DB.Replace<User>()
            .MatchID(id)
            .WithEntity(user)
            .ExecuteAsync();
        if (result.MatchedCount == 0)
        {
            _logger.LogWarning("No user {Id} was found to update", id);
        }
        else if (result.ModifiedCount == 0)
        {
            _logger.LogError("Could not update {Id} with {@User}", id, user);
        }
    }

    public async Task Remove(User user)
    {
        _logger.LogDebug("Removing user {User}", user);
        await Remove(user.ID);
    }

    public async Task Remove(string id)
    {
        _logger.LogWarning("Removing user {User}", id);
        await DB.DeleteAsync<User>(id);
    }
}
