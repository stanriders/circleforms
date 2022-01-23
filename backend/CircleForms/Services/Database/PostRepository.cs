using System;
using System.Linq;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using StackExchange.Redis;

namespace CircleForms.Services.Database;

public class PostRepository : IPostRepository
{
    private readonly ILogger<PostRepository> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly MongoClient _client;

    public PostRepository(IConfiguration config, ILogger<PostRepository> logger, IConnectionMultiplexer redis)
    {
        _logger = logger;
        _redis = redis;

        _client = new MongoClient(config.GetConnectionString("Database"));
    }
    public async Task<User> AddPost(long id, Post post)
    {
        var database = _client.GetDatabase("circleforms");
        var users = database.GetCollection<User>("users");

        var update = Builders<User>.Update.AddToSet(x => x.Posts, post);
        var user = await users.FindOneAndUpdateAsync(x => x.Id == id, update);

        var postId = $"post:{post.Id}";
        var redisDb = _redis.GetDatabase();
        var transaction = redisDb.CreateTransaction();
        _ = transaction.HashSetAsync(postId, "author", post.AuthorId);
        _ = transaction.HashSetAsync(postId, "title", post.Title);
        _ = transaction.HashSetAsync(postId, "description", post.Description);
        if (!await transaction.ExecuteAsync())
        {
            _logger.LogError("Could not post {PostId} to the redis cache", post.Id.ToString());

            return user;
        }

        await redisDb.SortedSetAddAsync("posts", postId, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());

        return user;
    }

    public async Task<Post> GetPost(string postId)
    {
        var database = _client.GetDatabase("circleforms");
        var users = database.GetCollection<User>("users");

        var objId = ObjectId.Parse(postId);
        var filter = Builders<User>.Filter.ElemMatch(x => x.Posts, x => x.Id == objId);
        var post = await users.Find(filter).Project(x => x.Posts.First(post => post.Id == objId)).FirstOrDefaultAsync();

        return post;
    }

    public async Task<Post[]> GetPostsPaged(int page, int pageSize = 50)
    {
        var redisDb = _redis.GetDatabase();
        var ids = await redisDb.SortedSetRangeByScoreAsync("posts", take: pageSize, skip: page * pageSize);

        if (ids.Length == 0)
        {
            return Array.Empty<Post>();
        }

        var tasks = new Task<RedisValue[]>[ids.Length];
        for (var i = 0; i < ids.Length; i++)
        {
            tasks[i] = redisDb.HashValuesAsync(new RedisKey(ids[i]));
        }

        await Task.WhenAll(tasks);

        var posts = new Post[ids.Length];
        for (var i = 0; i < ids.Length; i++)
        {
            var redisValue = tasks[i].Result;
            posts[i] = new Post
            {
                AuthorId = (long) redisValue[0],
                Title = redisValue[1],
                Description = redisValue[2]
            };
        }

        return posts;
    }
}
