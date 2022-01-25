using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Models.Posts;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace CircleForms.Services.Database;

public class PostRepository : IPostRepository
{
    private readonly ILogger<PostRepository> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IMongoCollection<User> _users;

    public PostRepository(ILogger<PostRepository> logger, IConnectionMultiplexer redis, IMongoDatabase database)
    {
        _logger = logger;
        _redis = redis;
        _users = database.GetCollection<User>("users");
    }

    public async Task<Post> Add(long id, Post post)
    {
        post.PublishTime = DateTime.UtcNow;

        var publishUnixTime = ((DateTimeOffset) post.PublishTime).ToUnixTimeMilliseconds();

        var update = Builders<User>.Update.AddToSet(x => x.Posts, post);
        var updatedUser = await _users.FindOneAndUpdateAsync(x => x.Id == id, update);
        if (updatedUser.Posts.All(x => x.Id != post.Id))
        {
            _logger.LogCritical("Post was not created in the database. Post: {@Post}, User: {@User}", post,
                updatedUser);

            return null;
        }

        var postId = $"post:{post.Id}";
        var redisDb = _redis.GetDatabase();

        var postRedis = PostRedis.FromPost(post);
        var postJson = JsonConvert.SerializeObject(postRedis);

        if (!await redisDb.StringSetAsync(postId, postJson))
        {
            _logger.LogError("Could not post {@Post} to the redis cache", postRedis);

            return post;
        }

        if (!await redisDb.SortedSetAddAsync("posts", postId, publishUnixTime))
        {
            _logger.LogError("Could not post {PostId} with {UnixTime} to the redis posts", postId, publishUnixTime);
        }

        return post;
    }

    public async Task<List<Post>> Get()
    {
        var filterDefinition = Builders<User>.Filter.SizeGt(x => x.Posts, 0);
        var postDefinition = Builders<User>.Projection.Expression(x => x.Posts);
        var postsDocuments = await _users.Find(filterDefinition).Project(postDefinition).ToListAsync();

        return postsDocuments.SelectMany(x => x).ToList();
    }

    public async Task<Post> Get(string postId)
    {
        var objId = ObjectId.Parse(postId);
        var filter = Builders<User>.Filter.ElemMatch(x => x.Posts, x => x.Id == objId);
        var post = await _users.Find(filter).Project(x => x.Posts.First(post => post.Id == objId))
            .FirstOrDefaultAsync();

        return post;
    }

    public async Task<PostRedis[]> GetCached()
    {
        var redisDb = _redis.GetDatabase();
        var ids = redisDb.SortedSetRangeByScore("posts", order: Order.Descending);

        return await IdsToPosts(ids, redisDb);
    }

    public async Task<PostRedis> GetCached(string postId)
    {
        var redisDb = _redis.GetDatabase();
        var val = await redisDb.StringGetAsync($"post:{postId}");

        return JsonConvert.DeserializeObject<PostRedis>(val);
    }

    public async Task<PostRedis[]> GetCachedPage(int page, int pageSize = 50)
    {
        var redisDb = _redis.GetDatabase();
        var ids = redisDb.SortedSetRangeByScore("posts", order: Order.Descending, skip: (page - 1) * pageSize,
            take: pageSize);

        return await IdsToPosts(ids, redisDb);
    }

    private static async Task<PostRedis[]> IdsToPosts(IReadOnlyList<RedisValue> ids, IDatabaseAsync redisDb)
    {
        if (ids.Count == 0)
        {
            return Array.Empty<PostRedis>();
        }

        var tasks = new Task<RedisValue>[ids.Count];
        for (var i = 0; i < ids.Count; i++)
        {
            tasks[i] = redisDb.StringGetAsync(new RedisKey(ids[i]));
        }

        await Task.WhenAll(tasks);

        var posts = new PostRedis[ids.Count];
        for (var i = 0; i < ids.Count; i++)
        {
            var redisValue = tasks[i].Result;
            posts[i] = JsonConvert.DeserializeObject<PostRedis>(redisValue);
        }

        return posts;
    }
}
