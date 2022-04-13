﻿using System.Threading.Tasks;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Users;

namespace CircleForms.Database.Services.Abstract;

public interface ICacheRepository
{
    Task IncrementAnswers(string id);
    Task<bool> PinPost(string id);
    Task<PostRedis> Publish(Post post);
    Task Unpublish(string id);

    Task Purge();

    Task<bool> UserExists(string id);
    Task AddUser(User user);
    Task<UserMinimalRedis> GetMinimalUser(string id);

    Task<PostRedis> AddOrUpdate(Post post);
    Task<PostRedis> GetPost(string id);
    Task<PostRedis[]> GetPinnedPosts();
    Task<PostRedis[]> GetDump();
    Task<int> GetAnswerCount(string id);
    Task<PostRedis[]> GetPage(int page, int pageSize, PostFilter filter);
    Task RemoveUser(string userId);
}