using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Models;
using CircleForms.Models.Users;
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
    private readonly IMapper _mapper;
    private readonly IUserRepository _usersService;

    public UsersController(ILogger<UsersController> logger, IMapper mapper, IUserRepository usersService)
    {
        _logger = logger;
        _mapper = mapper;
        _usersService = usersService;
    }

    /// <summary>
    ///     Get user data.
    /// </summary>
    [HttpGet(ApiEndpoints.UsersGetUser)]
    [ProducesResponseType(typeof(UserResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get([RegularExpression(@"^\d+$")] string id)
    {
        var user = await _usersService.Get(id);
        if (user != null)
        {
            return Ok(_mapper.Map<UserResponseContract>(user));
        }

        return NotFound();
    }

    /// <summary>
    ///     Get all users. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet(ApiEndpoints.UsersGetAllUsers)]
    public async Task<List<UserResponseContract>> GetAll()
    {
        _logger.LogInformation("Admin {Admin} requests users from the database", HttpContext.User.Identity?.Name);

        return _mapper.Map<List<User>, List<UserResponseContract>>(await _usersService.Get());
    }

    /// <summary>
    ///     Set user role. (Requires auth, Requires SuperAdmin role)
    /// </summary>
    [Authorize(Roles = "SuperAdmin")]
    [HttpPatch(ApiEndpoints.UsersEscalateUserPrivileges)]
    public async Task<UserResponseContract> EscalatePrivileges([RegularExpression(@"^\d$")] string id, int role)
    {
        var user = await _usersService.Get(id);
        user.Roles = (Roles) role;

        _logger.LogWarning("SuperAdmin {Admin} changes privileges of {Id} to {Role}", HttpContext.User.Identity?.Name,
            id, user.Roles.ToString());

        await _usersService.Update(id, user);

        return _mapper.Map<UserResponseContract>(user);
    }

    /// <summary>
    ///     Get data for current user. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpGet(ApiEndpoints.UsersGetMe)]
    [ProducesResponseType(typeof(UserResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMe()
    {
        var claim = HttpContext.User.Identity?.Name;
        if (!string.IsNullOrEmpty(claim) && long.TryParse(claim, out var userId))
        {
            _logger.LogInformation("User {User} requests /me", userId);

            var user = await _usersService.Get(claim);
            if (user != null)
            {
                return Ok(_mapper.Map<UserResponseContract>(user));
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
