using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Models.Configurations;
using CircleForms.Services.Database.Interfaces;
using CircleForms.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace CircleForms.Controllers.Authorization.OAuth;

[ApiController]
[Route("[controller]")]
public class OAuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<OAuthController> _logger;
    private readonly IOsuUserProvider _osuApiDataService;
    private readonly IConnectionMultiplexer _redis;
    private readonly IOptions<SuperAdminsId> _superAdminsId;
    private readonly IUserRepository _usersRepository;

    public OAuthController(IConfiguration configuration, ILogger<OAuthController> logger,
        IOsuUserProvider osuApiDataService,
        IUserRepository usersRepository, IConnectionMultiplexer redis,
        IOptions<SuperAdminsId> _superAdminsId)
    {
        _configuration = configuration;
        _logger = logger;
        _osuApiDataService = osuApiDataService;
        _usersRepository = usersRepository;
        _redis = redis;
        this._superAdminsId = _superAdminsId;
    }


    [HttpGet("auth")]
    public IActionResult Authenticate()
    {
        var authenticationProperties = new AuthenticationProperties
        {
            RedirectUri = Url.Action("CompleteAuthentication", "OAuth")
        };

        return Challenge(authenticationProperties, "osu");
    }

    [ApiExplorerSettings(IgnoreApi = true)]
    [HttpGet("complete")]
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
                var superAdminId = _superAdminsId.Value.Ids;
                if (superAdminId.Contains(user.Id))
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

        user = dbUser;

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

        await HttpContext.SignInAsync("InternalCookies", new ClaimsPrincipal(id), authProperties);
        await HttpContext.SignOutAsync("ExternalCookies");

        _logger.LogDebug("User {Username} logged in", user.Username);

        // FIXME: better redirects
        return Redirect("https://circleforms.net/");
    }

    [HttpGet("signout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync("InternalCookies");

        // FIXME: better redirects
        return Redirect("https://circleforms.net/");
    }
}
