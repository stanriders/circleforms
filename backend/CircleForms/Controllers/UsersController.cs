using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly IUserRepository _usersService;

    public UsersController(ILogger<UsersController> logger, IUserRepository usersService)
    {
        _logger = logger;
        _usersService = usersService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id:long}")]
    public async Task<IActionResult> Get(long id)
    {
        var user = await _usersService.Get(id);
        if (user != null)
        {
            return Ok(user);
        }

        return NotFound();
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<List<User>> GetAll()
    {
        return await _usersService.Get();
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpPatch]
    public async Task<User> EscalatePrivileges(long id, int role)
    {
        var user = await _usersService.Get(id);
        user.Roles = (Roles) role;
        await _usersService.Update(id, user);

        return user;
    }

    [Authorize]
    [HttpGet("/Self")]
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
