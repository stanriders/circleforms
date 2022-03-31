using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models.Posts;

namespace CircleForms.Services.Database.Interfaces;

public interface IPostRepository
{
    Task<Post> Add(string id, Post post);
    Task<List<Post>> Get();
    Task<Post> Get(string postId);
    Task Update(string id, Post post);
    Task AddAnswer(string postId, Answer entry);
}
