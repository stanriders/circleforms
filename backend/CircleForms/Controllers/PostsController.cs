
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
    private readonly IUserRepository _usersRepository;

    public PostsController(ILogger<PostsController> logger, IUserRepository usersRepository)
    {
        _logger = logger;
        _usersRepository = usersRepository;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string id)
    {
        return Ok(await _usersRepository.GetPost(id));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post(Post post)
    {
        var claim = HttpContext.User.Identity?.Name;
        if (!string.IsNullOrEmpty(claim) && long.TryParse(claim, out var userId))
        {
            post.AuthorId = userId;
            var result = await _usersRepository.AddPost(userId, post);

            return Ok(result);
        }
        else
        {
            _logger.LogWarning("User had an invalid name claim: {Claim}", claim);
        }

        return BadRequest();
    }
}
