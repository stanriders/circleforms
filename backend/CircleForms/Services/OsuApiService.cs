
using System.Threading.Tasks;
using CircleForms.Models.Configurations;
using CircleForms.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RestSharp;

namespace CircleForms.Services
{
    public class OsuApiService : IOsuApiService
    {
        private readonly IRestClient _restClient;
        private readonly OsuApiConfig _config;
        private readonly ILogger<OsuApiService> _logger;

        public OsuApiService(IRestClient restClient, IOptions<OsuApiConfig> config, ILogger<OsuApiService> logger)
        {
            _restClient = restClient;
            _logger = logger;
            _config = config.Value;
        }

        public async Task<string> Authenticate()
        {
            return "";
        }
    }
}
