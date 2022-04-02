using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CircleForms.Models.Posts;
using CircleForms.Models.Users;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Entities;

namespace CircleForms.Services.Database;

public class PostRepository : IPostRepository
{
    private readonly ILogger<PostRepository> _logger;

    public PostRepository(ILogger<PostRepository> logger)
    {
        _logger = logger;
    }

    public async Task<Post> Add(string id, Post post)
    {
        post.PublishTime = DateTime.UtcNow;
        post.Answers = new List<Answer>();

        _logger.LogInformation("User {Id} created a new post", id);
        _logger.LogDebug("User {Id} created a new post {@Post}", id, post);

        await DB.Update<User>()
            .MatchID(id)
            .Modify(v => v.AddToSet(f => f.Posts, post))
            .ExecuteAsync();

        return post;
    }

    public async Task<List<Post>> Get()
    {
        var filterDefinition = DB.Filter<User>()
            .SizeGt(x => x.Posts, 0);

        var postsDocuments = await DB.Find<User, List<Post>>()
            .Match(filterDefinition)
            .Project(a => a.Posts)
            .ExecuteAsync();

        return postsDocuments.SelectMany(x => x).ToList();
    }

    public async Task<Post> Get(string postId)
    {
        var filter = Builders<User>.Filter.ElemMatch(x => x.Posts, x => x.ID == postId);

        var post = await DB.Find<User, Post>()
            .Match(filter)
            .Project(x => x.Posts.First(post => post.ID == postId))
            .ExecuteFirstAsync();

        return post;
    }

    public async Task AddAnswer(string postId, Answer entry)
    {
        var filter = Builders<User>.Filter.ElemMatch(x => x.Posts, post => post.ID == postId);
        var result = await DB.Update<User>()
            .Match(filter)
            .Modify(a => a.AddToSet(v => v.Posts[-1].Answers, entry))
            .ExecuteAsync();
        if (result.ModifiedCount != 1)
        {
            _logger.LogError("Could not add answer {@Entry} to {PostId}", entry, postId);
        }
    }

    public async Task Update(string id, Post post)
    {
        var filter = Builders<User>.Filter.ElemMatch(x => x.Posts, x => x.ID == id);

        var result = await DB.Update<User>()
            .Match(filter)
            .Modify(x => x.Set(v => v.Posts[-1], post))
            .ExecuteAsync();
        if (result.ModifiedCount == 0)
        {
            _logger.LogError("Post {@Post} with id {Id} modified 0 entities", post, id);

            return;
        }

        if (result.ModifiedCount != 1)
        {
            _logger.LogError("Post {@Post} with id {Id} modified {Count} entities", post, id, result.ModifiedCount);
        }
    }
}
