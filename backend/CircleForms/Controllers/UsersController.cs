using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Commands;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Models;
using CircleForms.Queries;
using MediatR;
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
    private readonly IMediator _mediator;

    public UsersController(ILogger<UsersController> logger, IMapper mapper, IMediator mediator)
    {
        _logger = logger;
        _mapper = mapper;
        _mediator = mediator;
    }

    /// <summary>
    ///     Get user data.
    /// </summary>
    [HttpGet(ApiEndpoints.UsersGetUser)]
    [ProducesResponseType(typeof(UserResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get([RegularExpression(@"^\d$")] string id)
    {
        var user = await _mediator.Send(new GetUserQuery(id));
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

        var users = await _mediator.Send(new GetAllUsersQuery());

        return _mapper.Map<List<User>, List<UserResponseContract>>(users);
    }

    /// <summary>
    ///     Set user role. (Requires auth, Requires SuperAdmin role)
    /// </summary>
    [Authorize(Roles = "SuperAdmin")]
    [HttpPatch(ApiEndpoints.UsersEscalateUserPrivileges)]
    public async Task<IActionResult> EscalatePrivileges([RegularExpression(@"^\d$")] string id, int role)
    {
        var r = (Roles) role;
        _logger.LogWarning("SuperAdmin {Admin} changes privileges of {Id} to {Role}", HttpContext.User.Identity?.Name,
            id, r);

        var user = await _mediator.Send(new EscalatePrivilegesCommand(id, r));
        if (user is null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<UserResponseContract>(user));
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

            var user = await _mediator.Send(new GetUserQuery(claim));
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
