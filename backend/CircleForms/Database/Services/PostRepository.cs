using System;
using System.Collections.Generic;
using System.Linq.Expressions;
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

        await post.SaveAsync();

        await DB.Entity<User>(userId).PostsRelation.AddAsync(post);

        _logger.LogInformation("User {Id} created a new post", userId);
        _logger.LogDebug("User {Id} created a new post {@Post}", userId, post);

        return post;
    }

    public async Task<List<Post>> Get()
    {
        return await DB.Fluent<Post>().ToListAsync();
    }

    public async Task<List<Post>> Get(List<string> posts)
    {
        return await DB.Fluent<Post>()
            .Match(x => x.In(v => v.ID, posts))
            .ToListAsync();
    }

    public async Task<Post> Get(string postId)
    {
        return await DB.Find<Post>().OneAsync(postId);
    }

    public async Task<Post> Get(string postId, Expression<Func<Post, Post>> projection)
    {
        return await DB.Find<Post>().Project(projection).OneAsync(postId);
    }

    public async Task Update(Post post)
    {
        await post.SaveAsync();
    }
}
