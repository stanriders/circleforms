using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Contracts.V1;
using CircleForms.Models;
using CircleForms.Models.Configurations;
using CircleForms.Models.OsuContracts;
using CircleForms.Services.Database.Interfaces;
using CircleForms.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace CircleForms.Controllers.V1.Authorization.OAuth;

[ApiController]
[Route("[controller]")]
public class OAuthController : ControllerBase
{
    private readonly ILogger<OAuthController> _logger;
    private readonly IMapper _mapper;
    private readonly IOsuUserProvider _osuApiDataService;
    private readonly IConnectionMultiplexer _redis;
    private readonly List<long> _superAdminsId;
    private readonly IUserRepository _usersRepository;

    public OAuthController(ILogger<OAuthController> logger,
        IOsuUserProvider osuApiDataService,
        IUserRepository usersRepository, IConnectionMultiplexer redis,
        IOptions<SuperAdminsId> superAdminsId, IMapper mapper)
    {
        _logger = logger;
        _osuApiDataService = osuApiDataService;
        _usersRepository = usersRepository;
        _redis = redis;
        _mapper = mapper;
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

        var osuUser =
            await _osuApiDataService.GetUser(await HttpContext.GetTokenAsync("ExternalCookies", "access_token"));
        if (osuUser.IsRestricted)
        {
            _logger.LogInformation("User {User} tried logging in, but they are restricted!", osuUser.Id);

            return Forbid();
        }

        var user = _mapper.Map<OsuUser, User>(osuUser);

        var userId = osuUser.Id;
        var redisDb = _redis.GetDatabase();
        if (!redisDb.SetContains("user_ids", userId))
        {
            if (await _usersRepository.Get(user.ID) == null)
            {
                if (_superAdminsId.Contains(userId))
                {
                    user.Roles = Roles.SuperAdmin | Roles.Admin | Roles.Moderator;
                }

                _logger.LogInformation("Adding user {Id} - {Username} to the database", user.ID, user.Username);
                await _usersRepository.Create(user);
            }
            else
            {
                _logger.LogWarning("User {Id} - {Username} found in the database but was not cached", user.ID,
                    user.Username);
            }

            await redisDb.SetAddAsync("user_ids", userId);
        }

        var dbUser = await _usersRepository.Get(user.ID);
        if (dbUser is null)
        {
            _logger.LogCritical("Something went horribly wrong. User is not in the database. User: {@User}", user);
            await HttpContext.SignOutAsync("InternalCookies");
            await HttpContext.SignOutAsync("ExternalCookies");

            await redisDb.SetRemoveAsync("user_ids", userId);

            return StatusCode(500);
        }

        user = TransferMutableData(dbUser, user);

        var updateTask = _usersRepository.Update(user.ID, user);
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.ID),
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
