using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using CircleForms.Services.Database.Interfaces;
using CircleForms.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers.Authorization.OAuth;

[ApiController]
[Route("[controller]")]
public class OAuthController : ControllerBase
{
    private readonly ILogger<OAuthController> _logger;
    private readonly IOsuUserProvider _osuApiDataService;
    private readonly ITokenService _tokenService;
    private readonly IUserRepository _usersService;

    public OAuthController(ITokenService tokenService, ILogger<OAuthController> logger,
        IOsuUserProvider osuApiDataService, IUserRepository usersService)
    {
        _tokenService = tokenService;
        _logger = logger;
        _osuApiDataService = osuApiDataService;
        _usersService = usersService;
    }

    [HttpGet]
    public async Task<IActionResult> NewCode([FromQuery(Name = "code")] string code, CancellationToken cancellation)
    {
        var token = await _tokenService.NewCode(code);
        var user = await _osuApiDataService.GetUser(token);
        user.Token = token;

        if (user.IsRestricted)
        {
            return Forbid();
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Id.ToString())
        };
        var id = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true
        };

        //TODO: do something with it
        if (await _usersService.Get(user.Id) == null)
        {
            await _usersService.Create(user);
        }

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id),
            authProperties);

        return Ok();
    }
}
