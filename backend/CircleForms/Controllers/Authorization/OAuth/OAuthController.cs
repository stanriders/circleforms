using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Models.Configurations;
using CircleForms.Services.Database.Interfaces;
using CircleForms.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CircleForms.Controllers.Authorization.OAuth
{
    [ApiController]
    [Route("[controller]")]
    public class OAuthController : ControllerBase
    {
        private readonly ILogger<OAuthController> _logger;
        private readonly IOsuUserProvider _osuApiDataService;
        private readonly ISessionService _sessions;
        private readonly ITokenService _tokenService;
        private readonly JwtConfig _jwtConfig;
        private readonly IUserDatabaseService _usersService;

        public OAuthController(ITokenService tokenService, IOptions<JwtConfig> jwtConfig, ISessionService sessions, ILogger<OAuthController> logger,
            IOsuUserProvider osuApiDataService, IUserDatabaseService usersService)
        {
            _tokenService = tokenService;
            _jwtConfig = jwtConfig.Value;
            _sessions = sessions;
            _logger = logger;
            _osuApiDataService = osuApiDataService;
            _usersService = usersService;
        }

        [HttpGet]
        public async Task<IActionResult> NewCode([FromQuery(Name = "code")] string code, CancellationToken cancellation)
        {
            HttpContext.Session.Clear();
            var token = await _tokenService.NewCode(code);
            var user = await _osuApiDataService.GetUser(token);
            user.Token = token;

            if (user.IsRestricted)
            {
                return Forbid();
            }

            var session = new Session(user.Id);
            await _sessions.Add(session);

            HttpContext.Session.SetString("uid", session.Guid.ToString());

            //TODO: do something with it
            if (await _usersService.Get(user.Id) == null)
            {
                user = await _usersService.Create(user);
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtConfig.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                }),
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _jwtConfig.Issuer,
                Audience = _jwtConfig.Audience
            };
            var jwtToken = tokenHandler.CreateToken(tokenDescriptor);
            HttpContext.Response.Cookies.Delete("CRINGEC");
            HttpContext.Response.Cookies.Append("CRINGEC", tokenHandler.WriteToken(jwtToken));
            return Ok();
        }
    }
}
