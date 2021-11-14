using System;
using System.Linq;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Services.Database.Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApiController : ControllerBase
    {
        private readonly ILogger<ApiController> _logger;
        private readonly IUserDatabaseService _usersService;
        private readonly ISessionService _session;

        public ApiController(ILogger<ApiController> logger, IUserDatabaseService usersService, ISessionService session)
        {
            _logger = logger;
            _usersService = usersService;
            _session = session;
        }

        [HttpGet]
        public async Task<string> Get()
        {
            return string.Join(',', await _usersService.Get());
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpGet("/session")]
        public string GetSession()
        {
            var user = HttpContext.User;

            return user.Identity?.Name;
        }
    }
}
