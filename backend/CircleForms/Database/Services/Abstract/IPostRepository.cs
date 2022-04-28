using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts;

namespace CircleForms.Database.Services.Abstract;

public interface IPostRepository
{
    Task<Post> Add(string userId, Post post);
    Task<List<Post>> Get();
    Task<Post> Get(string postId);
    Task<Post> Get(string postId, Expression<Func<Post, Post>> projection);
    Task Update(Post post);
}
