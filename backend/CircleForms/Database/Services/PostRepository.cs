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

    public PostRepository(ILogger<PostRepository> logger)
    {
        _logger = logger;
    }

    public async Task<Post> Add(string userId, Post post)
    {
        post.AuthorRelation = userId;
        post.PublishTime = DateTime.UtcNow;

        _logger.LogInformation("User {Id} created a new post", userId);
        _logger.LogDebug("User {Id} created a new post {@Post}", userId, post);

        await post.SaveAsync();

        await DB.Entity<User>(userId).PostsRelation.AddAsync(post);

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
        post.Answers.Add(entry);
        await post.SaveAsync();
    }

    public async Task Update(Post post)
    {
        await post.SaveAsync();
    }
}
