﻿using System.Threading.Tasks;
using CircleForms.Services.Database.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApiController : ControllerBase
    {
        private readonly ILogger<ApiController> _logger;
        private readonly IUserRepository _usersService;

        public ApiController(ILogger<ApiController> logger, IUserRepository usersService)
        {
            _logger = logger;
            _usersService = usersService;
        }

        [HttpGet]
        public async Task<string> Get()
        {
            return string.Join(',', await _usersService.Get());
        }
    }
}
