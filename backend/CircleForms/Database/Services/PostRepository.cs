using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Users;
using CircleForms.Database.Services.Abstract;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Entities;

namespace CircleForms.Database.Services;

public class PostRepository : IPostRepository
{
    private readonly ILogger<PostRepository> _logger;
    private readonly IUserRepository _users;

    public PostRepository(ILogger<PostRepository> logger, IUserRepository users)
    {
        _logger = logger;
        _users = users;
    }

    public async Task<Post> Add(string userId, Post post)
    {
        post.Author = userId;
        post.PublishTime = DateTime.UtcNow;

        _logger.LogInformation("User {Id} created a new post", userId);
        _logger.LogDebug("User {Id} created a new post {@Post}", userId, post);

        await post.SaveAsync();

        await DB.Entity<User>(userId).Posts.AddAsync(post);

        return post;
    }

    public async Task<List<Post>> Get()
    {
        return await DB.Fluent<Post>().ToListAsync();
    }

    public async Task<Post> Get(string postId)
    {
        return await DB.Find<Post>().OneAsync(postId);
    }

    public async Task AddAnswer(Post post, Answer entry)
    {
        entry.Post = post;
        //TODO: transactions
        await entry.SaveAsync();
        await post.Answers.AddAsync(entry);
        await DB.Entity<User>(entry.User.ID).Answers.AddAsync(entry);
    }

    public async Task Update(Post post)
    {
        await post.SaveAsync();
    }
}
