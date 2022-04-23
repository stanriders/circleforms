using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Questions.Submissions;

namespace CircleForms.Database.Services.Abstract;

public interface IPostRepository
{
    Task<Post> Add(string userId, Post post);
    Task<List<Post>> Get();
    Task<Post> Get(string postId);
    Task Update(Post post);
    Task<Answer> AddAnswer(Post postId, List<Submission> entry, string author);
}
