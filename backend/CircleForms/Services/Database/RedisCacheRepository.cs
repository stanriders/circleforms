using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Extensions;
using CircleForms.Models.Posts;
using CircleForms.Models.Users;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace CircleForms.Services.Database;

public class RedisCacheRepository : ICacheRepository
{
    private const string _postsSet = "posts";
    private const string _activeSet = "posts:active";
    private const string _inactiveSet = "posts:inactive";
    private const string _pinnedSet = "posts:pinned";
    private const string _userIds = "user_ids";

    private readonly ILogger<RedisCacheRepository> _logger;
    private readonly IMapper _mapper;
    private readonly string[] _postOccupation = {_postsSet, _activeSet, _pinnedSet, _inactiveSet};
    private readonly IDatabase _redis;
    private readonly IConnectionMultiplexer _redisMultiplexer;

    public RedisCacheRepository(IConnectionMultiplexer redis, IMapper mapper, ILogger<RedisCacheRepository> logger)
    {
        _mapper = mapper;
        _logger = logger;
        _redis = redis.GetDatabase();
        _redisMultiplexer = redis;
    }

    public async Task IncrementAnswers(string id)
    {
        await _redis.StringIncrementAsync(ToPostAnswersCount(id));
    }

    public async Task<bool> PinPost(string id)
    {
        var key = ToPostId(id);

        if (!_redis.KeyExists(key))
        {
            return false;
        }

        await _redis.SetAddAsync(_pinnedSet, key);

        return true;
    }

    public async Task Purge()
    {
        var endpoints = _redisMultiplexer.GetEndPoints();
        foreach (var endpoint in endpoints)
        {
            await _redisMultiplexer.GetServer(endpoint).FlushAllDatabasesAsync();
        }
    }

    public async Task<bool> UserExists(string id)
    {
        return await _redis.SetContainsAsync(_userIds, id);
    }

    public async Task AddUser(User user)
    {
        await _redis.SetAddAsync(_userIds, user.ID);
        var cachedUser = _mapper.Map<User, UserMinimalRedis>(user);
        await _redis.StringSetAsync($"user:{user.ID}", JsonConvert.SerializeObject(cachedUser));
    }

    public async Task RemoveUser(string userId)
    {
        var id = ToUserId(userId);
        await Task.WhenAll(_redis.KeyDeleteAsync(id), _redis.SetRemoveAsync(_userIds, id));
    }

    public async Task Unpublish(string id)
    {
        await PurgePost(id);
    }

    public async Task<PostRedis> Publish(Post post)
    {
        await PurgePost(post.ID); //Purge just for fun

        var postId = ToPostId(post.ID);
        var postRedis = _mapper.Map<PostRedis>(post);
        var postJson = JsonConvert.SerializeObject(postRedis);

        _logger.LogInformation("Adding {Post} to the cache", postId);
        if (!await _redis.StringSetAsync(postId, postJson))
        {
            _logger.LogError("Could not post {@Post} to the redis cache", postRedis);

            return null;
        }

        var publishUnixTime = post.PublishTime.ToUnixTimestamp();
        _logger.LogInformation("Adding {PostId} to the cached posts set", postId);
        if (!await _redis.SortedSetAddAsync("posts", postId, publishUnixTime))
        {
            _logger.LogError("Could not post {PostId} with {UnixTime} to the redis posts", postId, publishUnixTime);
        }

        await SetActivity(post);

        return postRedis;
    }

    private static string ToPostId(string id)
    {
        return $"post:{id}";
    }

    private static string ToPostAnswersCount(string id)
    {
        return $"post:{id}:answers";
    }

    private static string ToUserId(string user)
    {
        return $"user:{user}";
    }

    public async Task PurgePost(string id)
    {
        var postId = ToPostId(id);
        _logger.LogInformation("Deleting {PostId} from cache", postId);
        var tasks = _postOccupation.Select(x => _redis.SortedSetRemoveAsync(x, postId));
        await Task.WhenAll(tasks);
        _redis.StringGetDelete(postId);
        _redis.StringGetDelete(ToPostAnswersCount(id));
    }

    private async Task SetActivity(Post post)
    {
        var removeFrom = post.IsActive ? _inactiveSet : _activeSet;
        var addTo = post.IsActive ? _activeSet : _inactiveSet;

        var postId = ToPostId(post.ID);
        await Task.WhenAll(
            _redis.SortedSetRemoveAsync(removeFrom, postId),
            _redis.SortedSetAddAsync(addTo, postId, post.PublishTime.ToUnixTimestamp())
        );
    }

    #region Mappings
    private async Task<PostRedis> Map(string key)
    {
        var value = await _redis.StringGetAsync(key);

        return !value.HasValue ? null : JsonConvert.DeserializeObject<PostRedis>(value);
    }

    private async Task<PostRedis> Map(RedisValue key)
    {
        return await Map(key.ToString());
    }

    private async Task<PostRedis[]> Map(IEnumerable<string> stringKeys)
    {
        var keys = stringKeys.Select(x => (RedisKey) x.ToString()).ToArray();

        return await Map(keys);
    }

    private async Task<PostRedis[]> Map(IEnumerable<RedisValue> stringKeys)
    {
        var keys = stringKeys.Select(x => (RedisKey) x.ToString()).ToArray();

        return await Map(keys);
    }

    private async Task<PostRedis[]> Map(RedisKey[] keys)
    {
        var values = await _redis.StringGetAsync(keys);

        return values.Select(x => !x.HasValue ? null : JsonConvert.DeserializeObject<PostRedis>(x)).ToArray();
    }
    #endregion

    #region CRUD
    public async Task<PostRedis> GetPost(string id)
    {
        var postId = ToPostId(id);

        return await Map(postId);
    }

    public async Task<PostRedis[]> GetDump()
    {
        var ids = _redis.SortedSetRangeByScore(_postsSet, order: Order.Descending);

        return await Map(ids);
    }

    public async Task<int> GetAnswerCount(string id)
    {
        var result = await _redis.StringGetAsync(ToPostAnswersCount(id));
        result.TryParse(out int val);

        return val;
    }

    public async Task<PostRedis> AddOrUpdate(Post post)
    {
        var map = _mapper.Map<PostRedis>(post);
        await _redis.StringSetAsync(ToPostId(post.ID), JsonConvert.SerializeObject(map));

        return map;
    }
    #endregion

    #region Pages
    public async Task<PostRedis[]> GetPinnedPosts()
    {
        var members = await _redis.SetMembersAsync(_pinnedSet);

        return await Map(members);
    }

    public async Task<PostRedis[]> GetPage(int page, int pageSize, PostFilter filter)
    {
        var key = filter switch
        {
            PostFilter.Both => _postsSet,
            PostFilter.Active => _activeSet,
            PostFilter.Inactive => _inactiveSet,
            _ => throw new ArgumentOutOfRangeException(nameof(filter), filter, null)
        };

        var ids = _redis.SortedSetRangeByScore(key, order: Order.Descending, skip: (page - 1) * pageSize,
            take: pageSize);

        return await Map(ids);
    }
    #endregion
}
