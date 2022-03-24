using System;
using System.Net;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Models.OsuContracts;
using CircleForms.Services.Interfaces;
using RestSharp;

namespace CircleForms.Services.Request;

public class OsuApiProvider : IOsuApiProvider
{
    private const string _apiMeLink = "https://osu.ppy.sh/api/v2/me";
    private const string _apiTokenLink = "https://osu.ppy.sh/oauth/token";
    private readonly IRestClient _client;

    public OsuApiProvider(IRestClient client)
    {
        _client = client;
    }

    public async Task<Result<OsuUser>> GetUser(string token)
    {
        _client.BaseUrl = new Uri(_apiMeLink);
        var request = new RestRequest();
        request.AddHeader("Authorization", $"Bearer {token}");


        var response = await _client.ExecuteGetAsync<OsuUser>(request);
        if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.OK)
        {
            return response.StatusCode == HttpStatusCode.Unauthorized
                ? new Result<OsuUser>(HttpStatusCode.Unauthorized, null)
                : new Result<OsuUser>(response.Data);
        }

        return new Result<OsuUser>(response.StatusCode, "An error occured on osu! user request");
    }

    public async Task<Result<Result<TokenResponse>>> RefreshToken(string refreshToken, RefreshTokenRequest config)
    {
        config.RefreshToken = refreshToken;

        _client.BaseUrl = new Uri(_apiTokenLink);
        var request = new RestRequest();
        request.AddJsonBody(config);

        var response = await _client.ExecuteGetAsync<TokenResponse>(request);

        return response.IsSuccessful
            ? new Result<Result<TokenResponse>>(response.Data)
            : new Result<Result<TokenResponse>>(response.StatusCode, "Could not refresh token");
    }
}
