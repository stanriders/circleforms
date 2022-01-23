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
    private readonly MongoClient _client;
    private readonly ILogger<PostRepository> _logger;
    private readonly IConnectionMultiplexer _redis;

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

        var offsetUnixTime = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var transaction = redisDb.CreateTransaction();
        _ = transaction.HashSetAsync(postId, "id", post.Id.ToString());
        _ = transaction.HashSetAsync(postId, "author", post.AuthorId);
        _ = transaction.HashSetAsync(postId, "title", post.Title);
        _ = transaction.HashSetAsync(postId, "description", post.Description);
        _ = transaction.HashSetAsync(postId, "publish_time", offsetUnixTime);
        if (!await transaction.ExecuteAsync())
        {
            _logger.LogError("Could not post {PostId} to the redis cache", post.Id.ToString());

            return user;
        }

        await redisDb.SortedSetAddAsync("posts", postId, offsetUnixTime);

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
        var ids = redisDb.SortedSetRangeByScore("posts", order: Order.Descending, skip: (page - 1) * pageSize,
            take: pageSize);

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
            posts[i] = new Post(redisValue[0])
            {
                AuthorId = (long) redisValue[1],
                Title = redisValue[2],
                Description = redisValue[3],
                PublishTime = DateTimeOffset.FromUnixTimeMilliseconds((long) redisValue[4]).UtcDateTime
            };
        }

        return posts;
    }
}
