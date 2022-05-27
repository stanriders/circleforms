using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Users;
using CircleForms.Database.Services.Abstract;
using CircleForms.Database.Services.Extensions;
using MapsterMapper;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace CircleForms.Database.Services;

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
        await _redis.StringIncrementAsync(id.ToPostAnswersCount());
    }

    public async Task<bool> PinPost(string id)
    {
        var key = id.ToPostId();

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
        if (!await _redis.SetAddAsync(_userIds, user.ID))
        {
            _logger.LogError("Could not post {@User} to the redis userid cache", user.ID);
        }

        var cachedUser = _mapper.Map<UserMinimalRedis>(user);
        if (!await _redis.StringSetAsync(user.ID.ToUserId(), JsonConvert.SerializeObject(cachedUser, Formatting.None)))
        {
            _logger.LogError("Could not post {@User} to the redis user cache", user);
        }
    }

    public async Task<UserMinimalRedis> GetMinimalUser(string id)
    {
        var userJson = await _redis.StringGetAsync(id.ToUserId());

        return !userJson.HasValue ? null : JsonConvert.DeserializeObject<UserMinimalRedis>(userJson);
    }

    public async Task RemoveUser(string userId)
    {
        var id = userId.ToUserId();
        await Task.WhenAll(_redis.KeyDeleteAsync(id), _redis.SetRemoveAsync(_userIds, userId));
    }

    public async Task Unpublish(string id)
    {
        await PurgePost(id);
    }

    public async Task<PostRedis> Publish(Post post)
    {
        await PurgePost(post.ID); //Purge just for fun

        var postId = post.ID.ToPostId();
        var postRedis = _mapper.Map<PostRedis>(post);
        var postJson = JsonConvert.SerializeObject(postRedis, Formatting.None);

        _logger.LogInformation("Adding {Post} to the cache", postId);
        if (!await _redis.StringSetAsync(postId, postJson))
        {
            _logger.LogError("Could not post {@Post} to the redis cache", postRedis);

            return null;
        }

        var publishUnixTime = post.PublishTime?.ToUnixTimestamp() ?? DateTime.UtcNow.ToUnixTimestamp();
        _logger.LogInformation("Adding {PostId} to the cached posts set", postId);
        if (!await _redis.SortedSetAddAsync("posts", postId, publishUnixTime))
        {
            _logger.LogError("Could not post {PostId} with {UnixTime} to the redis posts", postId, publishUnixTime);
        }

        await SetActivity(post);

        return postRedis;
    }


    public async Task PurgePost(string id)
    {
        var postId = id.ToPostId();
        _logger.LogInformation("Deleting {PostId} from cache", postId);
        var tasks = _postOccupation.Select(x => _redis.SortedSetRemoveAsync(x, postId));
        await Task.WhenAll(tasks);
        _redis.StringGetDelete(postId);
        _redis.StringGetDelete(id.ToPostAnswersCount());
    }

    private async Task SetActivity(Post post)
    {
        var removeFrom = post.IsActive ? _inactiveSet : _activeSet;
        var addTo = post.IsActive ? _activeSet : _inactiveSet;

        var postId = post.ID.ToPostId();
        await Task.WhenAll(
            _redis.StringSetAsync(post.ID.ToPostAnswersCount(), await post.Answers.ChildrenCountAsync()),
            _redis.SortedSetRemoveAsync(removeFrom, postId),
            _redis.SortedSetAddAsync(addTo, postId, post.PublishTime!.Value.ToUnixTimestamp())
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
        var postId = id.ToPostId();

        return await Map(postId);
    }

    public bool SetInactive(string id)
    {
        var postId = id.ToPostId();

        var score = _redis.SortedSetScore(_activeSet, postId);
        if (score is null)
        {
            return false;
        }

        var transaction = _redis.CreateTransaction();
        transaction.AddCondition(Condition.SortedSetContains(_activeSet, postId));
        transaction.SortedSetRemoveAsync(_activeSet, postId);
        transaction.SortedSetAddAsync(_inactiveSet, postId, score.Value);
        return transaction.Execute();
    }

    public async Task<PostRedis[]> GetDump()
    {
        var ids = _redis.SortedSetRangeByScore(_postsSet, order: Order.Descending);

        return await Map(ids);
    }

    public async Task<int> GetAnswerCount(string id)
    {
        var result = await _redis.StringGetAsync(id.ToPostAnswersCount());
        result.TryParse(out int val);

        return val;
    }

    public async Task<PostRedis> AddOrUpdate(Post post)
    {
        var map = _mapper.Map<PostRedis>(post);
        await _redis.StringSetAsync(post.ID.ToPostId(), JsonConvert.SerializeObject(map, Formatting.None));

        return map;
    }

    public async Task<string[]> GetAllIds()
    {
        var ids = await _redis.SortedSetRangeByScoreAsync(_postsSet, order: Order.Descending);

        // a bit of a hack, but since redis ids are the same as post ids this saves us redundant object fetches
        return ids.Select(x => x.ToString().Replace("post:", string.Empty)).ToArray();
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
