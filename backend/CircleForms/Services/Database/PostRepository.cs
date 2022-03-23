using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Models;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Entities;
using Newtonsoft.Json;
using StackExchange.Redis;
using Order = StackExchange.Redis.Order;

namespace CircleForms.Services.Database;

public class PostRepository : IPostRepository
{
    private readonly ILogger<PostRepository> _logger;
    private readonly IMapper _mapper;
    private readonly IConnectionMultiplexer _redis;

    public PostRepository(ILogger<PostRepository> logger, IMapper mapper, IConnectionMultiplexer redis)
    {
        _logger = logger;
        _mapper = mapper;
        _redis = redis;
    }

    public async Task<Post> Add(string id, Post post)
    {
        post.PublishTime = DateTime.UtcNow;
        post.Answers = new List<Answer>();

        var publishUnixTime = ToUnixTimestamp(post.PublishTime);

        _logger.LogInformation("User {Id} created a new post", id);

        await DB.Update<User>()
            .MatchID(id)
            .Modify(v => v.AddToSet(f => f.Posts, post))
            .ExecuteAsync();

        var postId = $"post:{post.ID}";
        var redisDb = _redis.GetDatabase();

        var postRedis = _mapper.Map<PostRedis>(post);
        var postJson = JsonConvert.SerializeObject(postRedis);

        _logger.LogInformation("Adding {Post} to the cache", postJson);
        if (!await redisDb.StringSetAsync(postId, postJson))
        {
            _logger.LogError("Could not post {@Post} to the redis cache", postRedis);

            return post;
        }

        if (post.Accessibility != Accessibility.Public)
        {
            return post;
        }

        _logger.LogInformation("Adding {PostId} to the cached posts set", postId);
        if (!await redisDb.SortedSetAddAsync("posts", postId, publishUnixTime))
        {
            _logger.LogError("Could not post {PostId} with {UnixTime} to the redis posts", postId, publishUnixTime);
        }

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

    public async Task<PostRedis[]> GetCachedPage(int page, int pageSize, PostFilter filter)
    {
        var key = filter switch
        {
            PostFilter.Both => "posts",
            PostFilter.Active => "posts:active",
            PostFilter.Inactive => "posts:inactive",
            _ => throw new ArgumentOutOfRangeException(nameof(filter), filter, null)
        };

        var redisDb = _redis.GetDatabase();
        var ids = redisDb.SortedSetRangeByScore(key, order: Order.Descending, skip: (page - 1) * pageSize,
            take: pageSize);

        return await IdsToPosts(ids, redisDb);
    }

    public async Task Update(string id, Post post, bool updateCache)
    {
        var filter = Builders<User>.Filter.ElemMatch(x => x.Posts, x => x.ID == id);

        var result = await DB.Update<User>()
            .Match(filter)
            .Modify(x => x.Set(v => v.Posts[-1], post))
            .ExecuteAsync();
        if (result.ModifiedCount == 0)
        {
            _logger.LogCritical("Post {@Post} with id {Id} modified 0 entities", post, id);

            return;
        }

        if (result.ModifiedCount != 1)
        {
            _logger.LogCritical("Post {@Post} with id {Id} modified {Count} entities", post, id, result.ModifiedCount);
        }

        if (!updateCache)
        {
            return;
        }

        var redisDb = _redis.GetDatabase();
        var removeFrom = post.IsActive ? "posts:inactive" : "posts:active";
        var addTo = post.IsActive ? "posts:active" : "posts:inactive";

        var postId = $"post:{id}";
        await Task.WhenAll(
            redisDb.SortedSetRemoveAsync(removeFrom, postId),
            redisDb.SortedSetAddAsync(addTo, postId, ToUnixTimestamp(post.PublishTime))
        );

        await redisDb.StringSetAsync(postId, JsonConvert.SerializeObject(_mapper.Map<PostRedis>(post)));
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
            _logger.LogInformation("Could not add answer {@Entry} to {PostId}", entry, postId);
        }
    }

    private static long ToUnixTimestamp(DateTime time)
    {
        return ((DateTimeOffset) time).ToUnixTimeMilliseconds();
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
