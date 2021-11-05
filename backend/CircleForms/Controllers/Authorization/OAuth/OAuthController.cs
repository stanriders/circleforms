using System.Threading.Tasks;
using CircleForms.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers.Authorization.OAuth
{
    [ApiController]
    [Route("[controller]")]
    public class OAuthController : ControllerBase
    {
        private readonly ILogger<OAuthController> _logger;
        private readonly IMeService _meService;
        private readonly ITokenService _tokenService;

        public OAuthController(ITokenService tokenService, ILogger<OAuthController> logger, IMeService meService)
        {
            _tokenService = tokenService;
            _logger = logger;
            _meService = meService;
        }

        [HttpGet]
        public async Task<IActionResult> NewCode([FromQuery(Name = "code")] string code)
        {
            var token = await _tokenService.NewCode(code);
            var user = await _meService.GetUser(token);
            if (user.IsRestricted)
            {
                return Forbid();
            }

            token.Id = user.Id;
            //TODO: do something with it

            _logger.LogInformation("{@User}", user);

            return Ok();
        }
    }
}
