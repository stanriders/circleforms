using System;
using System.Threading.Tasks;
using CircleForms.Models.Configurations;
using CircleForms.Models.OAuth;
using CircleForms.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RestSharp;

namespace CircleForms.Services
{
    public class TokenService : ITokenService
    {
        private readonly IRestClient _client;
        private readonly ILogger<TokenService> _logger;
        private readonly OsuApiConfig _config;
        private const string TokenRequest = "https://osu.ppy.sh/oauth/token";

        public TokenService(IRestClient client, ILogger<TokenService> logger, IOptions<OsuApiConfig> config)
        {
            client.BaseUrl = new Uri(TokenRequest);
            _client = client;
            _logger = logger;
            _config = config.Value;
        }

        public async Task<OAuthToken> NewCode(string code)
        {
            var request = new RestRequest();
            request.AddJsonBody(new
            {
                client_id = _config.ClientId,
                client_secret = _config.ClientSecret,
                code,
                grant_type = "authorization_code",
                redirect_uri = _config.CallbackUrl
            });
            
            return await _client.PostAsync<OAuthToken>(request);
        }
    }
}