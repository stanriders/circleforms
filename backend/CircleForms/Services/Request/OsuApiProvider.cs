using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Models;
using CircleForms.Models.Configurations;
using CircleForms.Models.OsuContracts;
using CircleForms.Services.Interfaces;
using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Serializers.NewtonsoftJson;

namespace CircleForms.Services.Request;

public class OsuApiProvider : IOsuApiProvider
{
    private const string _apiMeLink = "https://osu.ppy.sh/api/v2/me";
    private const string _apiTokenLink = "https://osu.ppy.sh/oauth/token";
    private readonly RestClient _getUserClient = new RestClient(_apiMeLink).UseNewtonsoftJson();
    private readonly RestClient _refreshTokenClient = new RestClient(_apiTokenLink).UseNewtonsoftJson();
    private readonly OsuApiConfig _config;
    private readonly IMapper _mapper;

    public OsuApiProvider(IOptions<OsuApiConfig> config, IMapper mapper)
    {
        _config = config.Value;
        _mapper = mapper;
    }

    public async Task<Result<OsuUser>> GetUser(string token)
    {
        var request = new RestRequest();
        request.AddHeader("Authorization", $"Bearer {token}");

        var response = await _getUserClient.ExecuteGetAsync<OsuUser>(request);

        return response.StatusCode switch
        {
            HttpStatusCode.OK => new Result<OsuUser>(response.Data),
            HttpStatusCode.Unauthorized => new Result<OsuUser>(HttpStatusCode.Unauthorized, null),
            _ => new Result<OsuUser>(response.StatusCode, "An error occured on osu! user request"),
        };
    }

    public async Task<Result<TokenResponse>> RefreshToken(string refreshToken)
    {
        var config = _mapper.Map<RefreshTokenRequest>(_config);
        config.RefreshToken = refreshToken;
        var request = new RestRequest()
            .AddJsonBody(config);
        var response = await _refreshTokenClient.ExecutePostAsync<TokenResponse>(request);

        return response.IsSuccessful
            ? new Result<TokenResponse>(response.Data)
            : new Result<TokenResponse>(response.StatusCode, "Could not refresh token");
    }
}
