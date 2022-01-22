using System;
using System.Threading.Tasks;
using CircleForms.Models.Configurations;
using CircleForms.Models.OAuth;
using CircleForms.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RestSharp;

namespace CircleForms.Services.Request;

public class TokenService : ITokenService
{
    private const string _tokenRequest = "https://osu.ppy.sh/oauth/token";
    private readonly IRestClient _client;
    private readonly OsuApiConfig _config;
    private readonly ILogger<TokenService> _logger;

    public TokenService(IRestClient client, ILogger<TokenService> logger, IOptions<OsuApiConfig> config)
    {
        client.BaseUrl = new Uri(_tokenRequest);
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
