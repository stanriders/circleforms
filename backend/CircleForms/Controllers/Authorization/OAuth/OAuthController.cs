using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CircleForms.Contracts;
using CircleForms.Controllers.Authorization.Configuration;
using CircleForms.Database.Models.Users;
using CircleForms.Database.Services.Abstract;
using CircleForms.ExternalAPI.OsuApi;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;

namespace CircleForms.Controllers.Authorization.OAuth;

[ApiController]
[Route("[controller]")]
public class OAuthController : ControllerBase
{
    private readonly ICacheRepository _cache;
    private readonly ILogger<OAuthController> _logger;
    private readonly IMapper _mapper;
    private readonly IOsuApiProvider _osuApiDataService;
    private readonly List<long> _superAdminsId;
    private readonly IUserRepository _usersRepository;

    public OAuthController(ILogger<OAuthController> logger,
        IOsuApiProvider osuApiDataService,
        IUserRepository usersRepository, ICacheRepository cache,
        IOptions<SuperAdminsId> superAdminsId, IMapper mapper)
    {
        _logger = logger;
        _osuApiDataService = osuApiDataService;
        _usersRepository = usersRepository;
        _cache = cache;
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

        var accessToken = await HttpContext.GetTokenAsync("ExternalCookies", "access_token");
        var refreshToken = await HttpContext.GetTokenAsync("ExternalCookies", "refresh_token");
        var osuUserResult = await _osuApiDataService.GetUser(accessToken);
        if (osuUserResult.IsError)
        {
            return Forbid();
        }

        var osuUser = osuUserResult.Value;
        if (osuUser.IsRestricted || osuUser.IsBot || osuUser.IsDeleted)
        {
            _logger.LogInformation("User {User} tried logging in, but they are restricted (or bot)!", osuUser.Id);

            return Forbid();
        }

        var userId = osuUser.Id.ToString();

        var user = await _usersRepository.Get(userId);
        if (user is null)
        {
            user = _mapper.Map<OsuUser, User>(osuUser);
            if (_superAdminsId.Contains(osuUser.Id))
            {
                user.Roles = Roles.SuperAdmin | Roles.Admin | Roles.Moderator;
            }

            _logger.LogInformation("Adding user {Id} - {Username} to the database", user.ID, osuUser.Username);

            await _usersRepository.Create(user);
        }

        user.Osu = osuUser.ToBsonDocument();

        user.Token = new TokenResponse
        {
            AccessToken = accessToken,
            ExpiresIn = 86400,
            RefreshToken = refreshToken,
            TokenType = "Bearer"
        };

        var updateTask = _usersRepository.Update(user.ID, user);
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.ID),
            new(ClaimTypes.Role, "User")
        };

        if (_superAdminsId.Contains(osuUser.Id))
        {
            claims.Add(new Claim(ClaimTypes.Role, "SuperAdmin"));
            claims.Add(new Claim(ClaimTypes.Role, "Admin"));
            claims.Add(new Claim(ClaimTypes.Role, "Moderator"));
        }
        else
        {
            //TODO: rewrite it
            if (user.Roles.HasFlag(Roles.Admin))
            {
                claims.Add(new Claim(ClaimTypes.Role, "Admin"));
            }

            if (user.Roles.HasFlag(Roles.Moderator))
            {
                claims.Add(new Claim(ClaimTypes.Role, "Moderator"));
            }
        }

        var id = new ClaimsIdentity(claims, "InternalCookies");
        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = authResult.Properties?.ExpiresUtc
        };

        await updateTask;

        await _cache.AddUser(user);

        await HttpContext.SignInAsync("InternalCookies", new ClaimsPrincipal(id), authProperties);
        await HttpContext.SignOutAsync("ExternalCookies");

        _logger.LogDebug("User {Username} logged in", osuUser.Username);

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
}
