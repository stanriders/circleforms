using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Database.Models.Users;
using CircleForms.Database.Services.Abstract;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace CircleForms.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly ICacheRepository _cache;
    private readonly ILogger<UsersController> _logger;
    private readonly IMapper _mapper;
    private readonly IUserRepository _usersService;

    public UsersController(ILogger<UsersController> logger, IMapper mapper, IUserRepository usersService,
        ICacheRepository cache)
    {
        _logger = logger;
        _mapper = mapper;
        _usersService = usersService;
        _cache = cache;
    }

    private string _claim => HttpContext.User.Identity!.Name;

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
    ///     Get user data.
    /// </summary>
    [HttpGet(ApiEndpoints.UsersGetMinimalUser)]
    [ProducesResponseType(typeof(UserMinimalResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMinimal([RegularExpression(@"^\d+$")] string id)
    {
        var user = await _cache.GetMinimalUser(id);
        if (user != null)
        {
            return Ok(_mapper.Map<UserMinimalResponseContract>(user));
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
        _logger.LogInformation("Admin {Admin} requests users from the database", _claim);

        return _mapper.Map<List<User>, List<UserResponseContract>>(await _usersService.Get());
    }

    /// <summary>
    ///     Set user role. (Requires auth, Requires SuperAdmin role)
    /// </summary>
    [Authorize(Roles = "SuperAdmin")]
    [HttpPatch(ApiEndpoints.UsersEscalateUserPrivileges)]
    [ProducesResponseType(typeof(UserResponseContract), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> EscalatePrivileges([RegularExpression(@"^\d+$")] string id, int roles)
    {
        var role = (Roles) roles;
        if (role.HasFlag(Roles.SuperAdmin))
        {
            return BadRequest("You can not escalate user's role to SuperAdmin");
        }

        var user = await _usersService.Get(id);
        user.Roles = role;

        _logger.LogWarning("SuperAdmin {Admin} changes privileges of {Id} to {Role}", _claim,
            id, user.Roles.ToString());

        await _usersService.Update(id, user);

        return Ok(_mapper.Map<UserResponseContract>(user));
    }

    [Authorize]
    [HttpGet(ApiEndpoints.UsersGetMePosts)]
    [ProducesResponseType(typeof(UserPostsResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMePosts()
    {
        var user = await _usersService.Get(_claim);
        if (user != null)
        {
            var posts = await user.PostsRelation.ChildrenFluent()
                .ToListAsync();

            return Ok(_mapper.Map<List<UserPostsResponseContract>>(posts));
        }

        _logger.LogWarning("User had a valid claim ({Claim}), but doesn't exist in the database!", _claim);

        await HttpContext.SignOutAsync("InternalCookies");

        return Unauthorized();
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
        _logger.LogInformation("User {User} requests /me", _claim);

        var user = await _usersService.Get(_claim);
        if (user != null)
        {
            var result = _mapper.Map<UserResponseContract>(user);

            return Ok(result);
        }

        _logger.LogWarning("User had a valid claim ({Claim}), but doesn't exist in the database!", _claim);

        await HttpContext.SignOutAsync("InternalCookies");

        return Unauthorized();
    }
}
