
using System.Threading.Tasks;
using CircleForms.Services.Database.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<PostsController> _logger;
    private readonly IUserRepository _usersService;

    public UsersController(ILogger<PostsController> logger, IUserRepository usersService)
    {
        _logger = logger;
        _usersService = usersService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(long id)
    {
        var user = await _usersService.Get(id);
        if (user != null)
        {
            return Ok(user);
        }

        return NotFound();
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetSelf()
    {
        var claim = HttpContext.User.Identity?.Name;
        if (!string.IsNullOrEmpty(claim) && long.TryParse(claim, out var userId))
        {
            var user = await _usersService.Get(userId);
            if (user != null)
            {
                return Ok(user);
            }
            _logger.LogWarning("User had a valid claim ({Claim}), but doesn't exist in the database!", claim);
        }
        else
        {
            _logger.LogWarning("User had an invalid name claim: {Claim}", claim);
        }

        // sign out in case of an invalid cookie just in case
        return SignOut("InternalCookies");
    }
}
