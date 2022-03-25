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

    public UserRepository(ILogger<UserRepository> logger, IConnectionMultiplexer redis)
    {
        _logger = logger;
        _redis = redis.GetDatabase();
    }

    public async Task<List<User>> Get()
    {
        return await DB.Find<User>().ManyAsync(x => true);
    }

    public async Task<User> Get(string id)
    {
        return await DB.Find<User>().OneAsync(id);
    }

    public async Task<UserMinimalRedis> GetMinimal(string id)
    {
        var userJson = await _redis.StringGetAsync($"user:{id}");
        return !userJson.HasValue ? null : JsonConvert.DeserializeObject<UserMinimalRedis>(userJson);
    }

    public async Task<User> Create(User user)
    {
        _logger.LogInformation("Creating a new user {@User}", user);

        user.Posts = new List<Post>();
        await DB.InsertAsync(user);

        return user;
    }

    public async Task Update(string id, User user)
    {
        _logger.LogInformation("Updating user {Id} with {@User}", id, user);

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
            _logger.LogWarning("Could not update {Id} with {@User}", id, user);
        }
    }

    public async Task Remove(User user)
    {
        _logger.LogWarning("Removing user {@User}", user);
        await DB.DeleteAsync<User>(user.ID);
    }

    public async Task Remove(string id)
    {
        _logger.LogWarning("Removing user {User}", id);
        await DB.DeleteAsync<User>(id);
    }
}
