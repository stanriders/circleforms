using System.Threading;
using System.Threading.Tasks;
using CircleForms.Database;
using CircleForms.Models;
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
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OAuthController> _logger;
        private readonly IMeService _osuApiDataService;
        private readonly ISessionService _sessions;
        private readonly ITokenService _tokenService;

        public OAuthController(ITokenService tokenService, ISessionService sessions, ILogger<OAuthController> logger,
            IMeService osuApiDataService, ApplicationDbContext context)
        {
            _tokenService = tokenService;
            _sessions = sessions;
            _logger = logger;
            _osuApiDataService = osuApiDataService;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> NewCode([FromQuery(Name = "code")] string code, CancellationToken cancellation)
        {
            HttpContext.Session.Clear();
            var token = await _tokenService.NewCode(code);
            var user = await _osuApiDataService.GetUser(token);

            _sessions.Remove(x => x.Id == user.Id);

            if (user.IsRestricted)
            {
                return Forbid();
            }

            token.Id = user.Id;
            var session = new Session(token.Id);
            _sessions.Add(session);

            HttpContext.Session.SetString("uid", session.Guid.ToString());

            //TODO: do something with it
            await _context.Tokens.AddAsync(token, cancellation);
            await _context.SaveChangesAsync(cancellation);

            return Ok();
        }
    }
}
