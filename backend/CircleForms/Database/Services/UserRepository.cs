﻿using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Database.Models.Users;
using CircleForms.Database.Services.Abstract;
using Microsoft.Extensions.Logging;
using MongoDB.Entities;

namespace CircleForms.Database.Services;

public class UserRepository : IUserRepository
{
    private readonly ILogger<UserRepository> _logger;

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

    public async Task<List<User>> Get(List<string> ids)
    {
        return await DB.Find<User>().ManyAsync(x => ids.Contains(x.ID));
    }

    public async Task<User> Create(User user)
    {
        _logger.LogInformation("Creating a new user {User}", user.ID);
        await user.SaveAsync();

        return user;
    }

    public async Task Update(string id, User user)
    {
        _logger.LogInformation("Updating user {Id}", id);
        _logger.LogDebug("Updating user {Id} to {@User}", id, user);

        user.ID = id;
        await user.SaveAsync();
    }

    public async Task Remove(User user)
    {
        _logger.LogDebug("Removing user {User}", user);
        await user.DeleteAsync();
    }
}
