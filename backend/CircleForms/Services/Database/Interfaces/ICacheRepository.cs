using System.Threading.Tasks;
using CircleForms.Models.Posts;

namespace CircleForms.Services.Database.Interfaces;

public interface ICacheRepository
{
    Task IncrementAnswers(string id);
    Task<bool> PinPost(string id);
    Task<PostRedis> Publish(Post post);
    Task Unpublish(string id);

    Task Purge();
    Task<bool> UserExists(string id);
    Task AddUserToUserIds(string id);

    Task<PostRedis> AddOrUpdate(Post post);
    Task<PostRedis> GetPost(string id);
    Task<PostRedis[]> GetPinnedPosts();
    Task<PostRedis[]> GetDump();
    Task<int> GetAnswerCount(string id);
    Task<PostRedis[]> GetPage(int page, int pageSize, PostFilter filter);
}
