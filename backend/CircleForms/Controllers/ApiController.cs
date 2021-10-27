using System.Linq;
using System.Threading.Tasks;
using CircleForms.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApiController : ControllerBase
    {
        private readonly ILogger<ApiController> _logger;
        private readonly ApplicationDbContext _dbContext;

        public ApiController(ILogger<ApiController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<string> Get()
        {
            return string.Join(',', await _dbContext.Users.Select(x=> x.Id).ToArrayAsync());
        }
    }
}
