using System.Threading.Tasks;
using CircleForms.Models;

namespace CircleForms.Services.Database.Interfaces;

public interface IPostRepository
{
    Task<User> AddPost(long id, Post post);
    Task<Post> GetPost(string postId);
    Task<Post[]> GetPostsPaged(int page, int pageSize = 50);
}
