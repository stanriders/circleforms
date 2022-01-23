using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CircleForms.Services.Database.Interfaces;
using CircleForms.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers.Authorization.OAuth;

[ApiController]
[Route("[controller]")]
public class OAuthController : ControllerBase
{
    private readonly ILogger<OAuthController> _logger;
    private readonly IOsuUserProvider _osuApiDataService;
    private readonly IUserRepository _usersRepository;

    public OAuthController(ILogger<OAuthController> logger, IOsuUserProvider osuApiDataService,
        IUserRepository usersRepository)
    {
        _logger = logger;
        _osuApiDataService = osuApiDataService;
        _usersRepository = usersRepository;
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

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Id.ToString()),
            new(ClaimTypes.Role, "User")
        };
        var id = new ClaimsIdentity(claims, "InternalCookies");
        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = authResult.Properties?.ExpiresUtc
        };

        if (await _usersRepository.Get(user.Id) == null)
        {
            _logger.LogInformation("Adding user {Id} - {Username} to the database", user.Id, user.Username);
            await _usersRepository.Create(user);
        }

        await HttpContext.SignInAsync("InternalCookies", new ClaimsPrincipal(id), authProperties);
        await HttpContext.SignOutAsync("ExternalCookies");

        _logger.LogInformation("User {Username} logged in.", user.Username);

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
