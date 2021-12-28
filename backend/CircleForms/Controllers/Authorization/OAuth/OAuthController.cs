using System.Threading;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using CircleForms.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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
        private readonly IUserRepository _usersService;

        public OAuthController(ITokenService tokenService, ISessionService sessions, ILogger<OAuthController> logger,
            IOsuUserProvider osuApiDataService, IUserRepository usersService)
        {
            _tokenService = tokenService;
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
                await _usersService.Create(user);
            }

            return Ok();
        }
    }
}
