﻿using System.Net;
using System.Threading.Tasks;
using CircleForms.Domain;
using CircleForms.ExternalAPI.OsuApi.Configurations;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using MapsterMapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Serializers.NewtonsoftJson;

namespace CircleForms.ExternalAPI.OsuApi;

public class OsuApiProvider : IOsuApiProvider
{
    private const string _osuBase = "https://osu.ppy.sh/";
    private const string _apiMeLink = "api/v2/me/";
    private const string _apiTokenLink = "oauth/token";

    private readonly RestClient _client = new RestClient(_osuBase)
        .UseNewtonsoftJson();

    private readonly OsuApiConfig _config;
    private readonly ILogger<OsuApiProvider> _logger;
    private readonly IMapper _mapper;

    public OsuApiProvider(IOptions<OsuApiConfig> config, IMapper mapper, ILogger<OsuApiProvider> logger)
    {
        _config = config.Value;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<OsuUser>> GetUser(string token)
    {
        var request = new RestRequest(_apiMeLink).AddHeader("Authorization", $"Bearer {token}");

        var response = await _client.ExecuteGetAsync<OsuUser>(request);

        if (!response.IsSuccessful)
        {
            _logger.LogWarning(response.Content);
        }

        return response.StatusCode switch
        {
            HttpStatusCode.OK => new Result<OsuUser>(response.Data),
            HttpStatusCode.Unauthorized => Result<OsuUser>.Error("", HttpStatusCode.Unauthorized),
            _ => Result<OsuUser>.Error("An error occurred on osu! user request", response.StatusCode)
        };
    }

    public async Task<Result<TokenResponse>> RefreshToken(string refreshToken)
    {
        var config = _mapper.Map<RefreshTokenRequest>(_config);
        config.RefreshToken = refreshToken;

        var request = new RestRequest(_apiTokenLink).AddJsonBody(config);
        var response = await _client.ExecutePostAsync<TokenResponse>(request);

        if (!response.IsSuccessful)
        {
            _logger.LogWarning("An error occured on token refreshing: {Response}", response.Content);

            return Result<TokenResponse>.Error("Could not refresh token", response.StatusCode);
        }

        return new Result<TokenResponse>(response.Data);
    }
}
