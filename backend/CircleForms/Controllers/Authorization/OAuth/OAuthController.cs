using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CircleForms.Contracts.V1;
using CircleForms.Models;
using CircleForms.Models.Configurations;
using CircleForms.Services.Database.Interfaces;
using CircleForms.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace CircleForms.Controllers.Authorization.OAuth;

[ApiController]
[Route("[controller]")]
public class OAuthController : ControllerBase
{
    private readonly ILogger<OAuthController> _logger;
    private readonly IOsuUserProvider _osuApiDataService;
    private readonly IConnectionMultiplexer _redis;
    private readonly List<long> _superAdminsId;
    private readonly IUserRepository _usersRepository;

    public OAuthController(ILogger<OAuthController> logger,
        IOsuUserProvider osuApiDataService,
        IUserRepository usersRepository, IConnectionMultiplexer redis,
        IOptions<SuperAdminsId> superAdminsId)
    {
        _logger = logger;
        _osuApiDataService = osuApiDataService;
        _usersRepository = usersRepository;
        _redis = redis;
        _superAdminsId = superAdminsId.Value.Ids;
    }

    /// <summary>
    ///     osu! API authentication.
    /// </summary>
    [HttpGet(ApiEndpoints.OAuthAuthentication)]
    [ProducesResponseType(StatusCodes.Status302Found)]
    public IActionResult Authenticate()
    {
        var authenticationProperties = new AuthenticationProperties
        {
            RedirectUri = Url.Action("CompleteAuthentication", "OAuth")
        };

        return Challenge(authenticationProperties, "osu");
    }

    [HttpGet("complete")]
    [ApiExplorerSettings(IgnoreApi = true)]
    [ProducesResponseType(StatusCodes.Status302Found)]
    public async Task<IActionResult> CompleteAuthentication()
    {
        var authResult = await HttpContext.AuthenticateAsync("ExternalCookies");
        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var user = await _osuApiDataService.GetUser(await HttpContext.GetTokenAsync("ExternalCookies", "access_token"));
        if (user.IsRestricted)
        {
            _logger.LogInformation("User {User} tried logging in, but they are restricted!", user.Id);

            return Forbid();
        }

        var redisDb = _redis.GetDatabase();
        if (!redisDb.SetContains("user_ids", user.Id))
        {
            if (await _usersRepository.Get(user.Id) == null)
            {
                if (_superAdminsId.Contains(user.Id))
                {
                    user.Roles = Roles.SuperAdmin | Roles.Admin | Roles.Moderator;
                }

                _logger.LogInformation("Adding user {Id} - {Username} to the database", user.Id, user.Username);
                await _usersRepository.Create(user);
            }
            else
            {
                _logger.LogWarning("User {Id} - {Username} found in the database but was not cached", user.Id,
                    user.Username);
            }

            await redisDb.SetAddAsync("user_ids", user.Id);
        }

        var dbUser = await _usersRepository.Get(user.Id);
        if (dbUser is null)
        {
            _logger.LogCritical("Something went horribly wrong. User is not in the database. User: {@User}", user);
            await HttpContext.SignOutAsync("InternalCookies");
            await HttpContext.SignOutAsync("ExternalCookies");

            return StatusCode(500);
        }

        user = TransferMutableData(dbUser, user);

        var updateTask = _usersRepository.Update(user.Id, user);
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Id.ToString()),
            new(ClaimTypes.Role, "User")
        };

        if (user.Roles.HasFlag(Roles.SuperAdmin))
        {
            claims.Add(new Claim(ClaimTypes.Role, "SuperAdmin"));
        }

        if (user.Roles.HasFlag(Roles.Admin))
        {
            claims.Add(new Claim(ClaimTypes.Role, "Admin"));
        }

        if (user.Roles.HasFlag(Roles.Moderator))
        {
            claims.Add(new Claim(ClaimTypes.Role, "Moderator"));
        }

        var id = new ClaimsIdentity(claims, "InternalCookies");
        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = authResult.Properties?.ExpiresUtc
        };

        await updateTask;

        await HttpContext.SignInAsync("InternalCookies", new ClaimsPrincipal(id), authProperties);
        await HttpContext.SignOutAsync("ExternalCookies");

        _logger.LogDebug("User {Username} logged in", user.Username);

        // FIXME: better redirects
        return Redirect("https://circleforms.net/");
    }

    /// <summary>
    ///     Sign out from current user. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpGet(ApiEndpoints.OAuthSignOut)]
    [ProducesResponseType(StatusCodes.Status302Found)]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync("InternalCookies");

        // FIXME: better redirects
        return Redirect("https://circleforms.net/");
    }

    private static User TransferMutableData(User dbUser, User osuUser)
    {
        osuUser.Discord = dbUser.Discord;
        osuUser.Posts = dbUser.Posts;
        osuUser.Roles = dbUser.Roles;

        return osuUser;
    }
}
