using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models.Posts;

namespace CircleForms.Services.Database.Interfaces;

public interface IPostRepository
{
    Task<Post> Add(long id, Post post);
    Task<List<Post>> Get();
    Task<Post> Get(string postId);

    Task<PostRedis[]> GetCached();
    Task<PostRedis> GetCached(string postId);
    Task<PostRedis[]> GetCachedPage(int page, int pageSize = 50);
    Task<Post> Update(string id, Post post, bool updateCache);
}
