using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Contracts.V1;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

    /// <summary>
    ///     Get user data. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet(ApiEndpoints.UsersGetUser)]
    [ProducesResponseType(typeof(User), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(long id)
    {
        _logger.LogInformation("Admin {Admin} requests User {Id}", HttpContext.User.Identity?.Name, id);

        var user = await _usersService.Get(id);
        if (user != null)
        {
            return Ok(user);
        }

        return NotFound();
    }

    /// <summary>
    ///     Get all users. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet(ApiEndpoints.UsersGetAllUsers)]
    public async Task<List<User>> GetAll()
    {
        _logger.LogInformation("Admin {Admin} requests users from the database", HttpContext.User.Identity?.Name);

        return await _usersService.Get();
    }

    /// <summary>
    ///     Set user role. (Requires auth, Requires SuperAdmin role)
    /// </summary>
    [Authorize(Roles = "SuperAdmin")]
    [HttpPatch(ApiEndpoints.UsersEscalateUserPrivileges)]
    public async Task<User> EscalatePrivileges(long id, int role)
    {
        var user = await _usersService.Get(id);
        user.Roles = (Roles) role;

        _logger.LogWarning("SuperAdmin {Admin} changes privileges of {Id} to {Role}", HttpContext.User.Identity?.Name,
            id, user.Roles.ToString());

        await _usersService.Update(id, user);

        return user;
    }

    /// <summary>
    ///     Get data for current user. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpGet(ApiEndpoints.UsersGetMe)]
    [ProducesResponseType(typeof(User), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMe()
    {
        var claim = HttpContext.User.Identity?.Name;
        if (!string.IsNullOrEmpty(claim) && long.TryParse(claim, out var userId))
        {
            _logger.LogInformation("User {User} requests /me", userId);

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
        await HttpContext.SignOutAsync("InternalCookies");

        return Unauthorized();
    }
}
