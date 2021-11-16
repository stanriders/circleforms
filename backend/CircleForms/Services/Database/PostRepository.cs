using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace CircleForms.Services.Database
{
    public class PostRepository : IPostRepository
    {
        private readonly IMongoCollection<Post> _posts;

        public PostRepository(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("Database"));
            var database = client.GetDatabase("circleforms");

            _posts = database.GetCollection<Post>("posts");
        }

        public async Task<List<Post>> Get()
        {
            return await (await _posts.FindAsync(x => true)).ToListAsync();
        }

        public async Task<Post> Get(long id)
        {
            return await (await _posts.FindAsync(x => x.Id == id)).FirstOrDefaultAsync();
        }

        public async Task<Post> Create(Post post)
        {
            await _posts.InsertOneAsync(post);

            return post;
        }

        public async Task Update(long id, Post post)
        {
            await _posts.ReplaceOneAsync(x => x.Id == id, post);
        }

        public async Task Remove(Post post)
        {
            await _posts.DeleteOneAsync(x => x.Id == post.Id);
        }

        public async Task Remove(long id)
        {
            await _posts.DeleteOneAsync(x => x.Id == id);
        }
    }
}
