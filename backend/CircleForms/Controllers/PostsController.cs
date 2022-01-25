using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models.Posts;
using CircleForms.Services.Database.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers;

[ApiController]
[Route("[controller]")]
public class PostsController : ControllerBase
{
    private readonly ILogger<PostsController> _logger;
    private readonly IPostRepository _postRepository;

    public PostsController(ILogger<PostsController> logger, IPostRepository postRepository)
    {
        _logger = logger;
        _postRepository = postRepository;
    }


    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post(Post post)
    {
        var claim = HttpContext.User.Identity?.Name;
        if (!string.IsNullOrEmpty(claim) && long.TryParse(claim, out var userId))
        {
            post.AuthorId = userId;
            var result = await _postRepository.Add(userId, post);

            if (result is null)
            {
                return StatusCode(500);
            }

            return CreatedAtAction("GetCachedPost", new {id = post.Id.ToString()}, result);
        }

        _logger.LogWarning("User had an invalid name claim: {Claim}", claim);

        return BadRequest();
    }

    #region Mongo
    [Authorize(Roles = "Admin")]
    [HttpGet("/posts/mongo/{id}")]
    public async Task<Post> Get(string id)
    {
        return await _postRepository.Get(id);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("/posts/mongo")]
    public async Task<List<Post>> Get()
    {
        return await _postRepository.Get();
    }
    #endregion

    #region Cache
    [Authorize(Roles = "Admin,Moderator")]
    [HttpGet("/posts")]
    public async Task<PostRedis[]> GetCached()
    {
        return await _postRepository.GetCached();
    }

    [HttpGet("/posts/{id}")]
    public async Task<PostRedis> GetCachedPost(string id)
    {
        return await _postRepository.GetCached(id);
    }

    [HttpGet("/posts/page/{page:int}")]
    public async Task<PostRedis[]> GetPage(int page)
    {
        return await _postRepository.GetCachedPage(page);
    }
    #endregion
}
