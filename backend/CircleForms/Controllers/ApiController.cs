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
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<ApiController> _logger;

        public ApiController(ILogger<ApiController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<string> Get()
        {
            return string.Join(',', await _dbContext.Tokens.Select(x => x.Id).ToArrayAsync());
        }
    }
}
