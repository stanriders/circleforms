using System.Threading.Tasks;
using CircleForms.Models;
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

    [HttpGet]
    public async Task<IActionResult> Get(string id)
    {
        return Ok(await _postRepository.GetPost(id));
    }

    [HttpGet("/page/{page:int}")]
    public async Task<Post[]> GetPage(int page)
    {
        return await _postRepository.GetPostsPaged(page);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post(Post post)
    {
        var claim = HttpContext.User.Identity?.Name;
        if (!string.IsNullOrEmpty(claim) && long.TryParse(claim, out var userId))
        {
            post.AuthorId = userId;
            var result = await _postRepository.AddPost(userId, post);

            return Ok(result);
        }

        _logger.LogWarning("User had an invalid name claim: {Claim}", claim);

        return BadRequest();
    }
}
