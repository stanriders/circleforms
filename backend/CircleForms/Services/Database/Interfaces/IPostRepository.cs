using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models.Posts;

namespace CircleForms.Services.Database.Interfaces;

public interface IPostRepository
{
    Task<Post> Add(string id, Post post);
    Task<List<Post>> Get();
    Task<Post> Get(string postId);

    Task<PostRedis[]> GetCached();
    Task<PostRedis> GetCached(string postId);
    Task<PostRedis[]> GetCachedPage(int page, int pageSize, PostFilter filter);
    Task Update(string id, Post post, bool updateCache);
    Task AddAnswer(string postId, Answer entry);
    Task<int> GetAnswerCount(string id);
    Task<bool> AddPinnedPosts(string postId);
    Task<PostRedis[]> GetPinnedPosts();
}
