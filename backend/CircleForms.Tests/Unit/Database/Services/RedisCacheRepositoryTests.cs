
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Database.Models.Users;
using CircleForms.Database.Services;
using CircleForms.Database.Services.Extensions;
using CircleForms.Tests.Utils;
using Microsoft.Extensions.Logging.Abstractions;
using MongoDB.Bson;
using Moq;
using StackExchange.Redis;
using Xunit;
using JsonConvert = Newtonsoft.Json.JsonConvert;

namespace CircleForms.Tests.Unit.Database.Services
{
    public class RedisCacheRepositoryTests
    {
        private readonly RedisCacheRepository _cache;
        private readonly Mock<IDatabase> _redisDatabaseMock;

        public RedisCacheRepositoryTests()
        {
            _redisDatabaseMock = new Mock<IDatabase>(MockBehavior.Strict);

            var redisMock = new Mock<IConnectionMultiplexer>();
            redisMock.Setup(x => x.GetDatabase(It.IsAny<int>(), It.IsAny<object>())).Returns(_redisDatabaseMock.Object);

            _cache = new RedisCacheRepository(redisMock.Object, MappingHelper.CreateMapper(),
                new NullLogger<RedisCacheRepository>());
        }

        [Fact]
        public async Task IncrementAnswersUsesCorrectId()
        {
            const string id = "123456";

            _redisDatabaseMock
                .Setup(x => x.StringIncrementAsync(It.Is<RedisKey>(y => y == id.ToPostAnswersCount()), It.IsAny<long>(),
                    It.IsAny<CommandFlags>()))
                .ReturnsAsync(1);

            await _cache.IncrementAnswers(id);
        }

        [Fact]
        public async Task PinPostAddsPostToTheSet()
        {
            var postId = new Guid().ToString();

            _redisDatabaseMock
                .Setup(x => x.KeyExists(It.Is<RedisKey>(y => y == postId.ToPostId()), It.IsAny<CommandFlags>()))
                .Returns(true);

            _redisDatabaseMock
                .Setup(x => x.SetAddAsync(It.Is<RedisKey>(y => y == "posts:pinned"),
                    It.Is<RedisValue>(y => y == postId.ToPostId()), It.IsAny<CommandFlags>()))
                .ReturnsAsync(true);

            var result = await _cache.PinPost(postId);

            Assert.True(result);
            _redisDatabaseMock.Verify();
        }

        [Fact]
        public async Task PinPostDoesntAddPostToTheSetWhenItDoesntExist()
        {
            var postId = new Guid().ToString();

            _redisDatabaseMock
                .Setup(x => x.KeyExists(It.Is<RedisKey>(y => y == postId.ToPostId()), It.IsAny<CommandFlags>()))
                .Returns(false);

            var result = await _cache.PinPost(postId);

            Assert.False(result);
            _redisDatabaseMock.Verify();
        }

        [Fact]
        public async Task AddUserAddsCorrectData()
        {
            var user = new User
            {
                ID = "123456",
                Discord = "Test#7270",
                Osu = new BsonDocument(new Dictionary<string, object>
                {
                    { "Username", "VsevolodVolkov" },
                    { "AvatarUrl", "https://a.ppy.sh/123456" }
                })
            };

            var expectedRedisUser = JsonConvert.SerializeObject(new UserMinimalRedis
            {
                ID = user.ID,
                Discord = user.Discord,
                Username = user.Osu["Username"].ToString(),
                AvatarUrl = user.Osu["AvatarUrl"].ToString()
            });

            _redisDatabaseMock
                .Setup(x => x.SetAddAsync(It.Is<RedisKey>(y => y == "user_ids"), It.Is<RedisValue>(y => y == user.ID),
                    It.IsAny<CommandFlags>()))
                .ReturnsAsync(true);

            _redisDatabaseMock
                .Setup(x => x.StringSetAsync(It.Is<RedisKey>(y => y == user.ID.ToUserId()),
                    It.Is<RedisValue>(y => y == expectedRedisUser),
                    It.IsAny<TimeSpan?>(), It.IsAny<When>(), It.IsAny<CommandFlags>()))
                .ReturnsAsync(true);

            await _cache.AddUser(user);

            _redisDatabaseMock.Verify();
        }

        [Fact]
        public async Task GetMinimalUserReturnsUserOnCorrectId()
        {
            var user = new UserMinimalRedis
            {
                ID = "123456",
                Username = "VsevolodVolkov",
                AvatarUrl = "https://a.ppy.sh/123456",
                Discord = "Test#7270"
            };

            _redisDatabaseMock
                .Setup(x => x.StringGetAsync(It.Is<RedisKey>(y => y == user.ID.ToUserId()), It.IsAny<CommandFlags>()))
                .ReturnsAsync(new RedisValue(JsonConvert.SerializeObject(user)));

            var result = await _cache.GetMinimalUser(user.ID);

            Assert.NotNull(result);
            Assert.Equal(user.ID, result.ID);
            Assert.Equal(user.Username, result.Username);
            Assert.Equal(user.AvatarUrl, result.AvatarUrl);
            Assert.Equal(user.Discord, result.Discord);
        }

        [Fact]
        public async Task GetMinimalUserReturnsNullOnIncorrectId()
        {
            var user = new UserMinimalRedis
            {
                ID = "123456",
                Username = "VsevolodVolkov",
                AvatarUrl = "https://a.ppy.sh/123456",
                Discord = "Test#7270"
            };

            _redisDatabaseMock
                .Setup(x => x.StringGetAsync(It.Is<RedisKey>(y => y == user.ID.ToUserId()), It.IsAny<CommandFlags>()))
                .ReturnsAsync(new RedisValue());

            var result = await _cache.GetMinimalUser(user.ID);

            Assert.Null(result);
        }

        [Fact]
        public async Task RemoveUserUsesCorrectIds()
        {
            const string id = "123456";

            _redisDatabaseMock
                .Setup(x => x.KeyDeleteAsync(It.Is<RedisKey>(y => y == id.ToUserId()), It.IsAny<CommandFlags>()))
                .ReturnsAsync(true);

            _redisDatabaseMock
                .Setup(x => x.SetRemoveAsync(It.Is<RedisKey>(y => y == "user_ids"), It.Is<RedisValue>(y => y == id), It.IsAny<CommandFlags>()))
                .ReturnsAsync(true);

            await _cache.RemoveUser(id);
        }
    }
}
