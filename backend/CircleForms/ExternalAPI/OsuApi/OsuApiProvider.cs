using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.ExternalAPI.OsuApi.Configurations;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using CircleForms.ModelLayer;
using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Serializers.NewtonsoftJson;

namespace CircleForms.ExternalAPI.OsuApi;

public class OsuApiProvider : IOsuApiProvider
{
    private const string _osuBase = "https://osu.ppy.sh/";
    private const string _apiMeLink = "api/v2/me";
    private const string _apiTokenLink = "oauth/token";

    private readonly RestClient _client = new RestClient(_osuBase)
        .UseNewtonsoftJson();

    private readonly OsuApiConfig _config;
    private readonly IMapper _mapper;

    public OsuApiProvider(IOptions<OsuApiConfig> config, IMapper mapper)
    {
        _config = config.Value;
        _mapper = mapper;
    }

    public async Task<Result<OsuUser>> GetUser(string token)
    {
        var request = new RestRequest(_apiMeLink)
            .AddHeader("Authorization", $"Bearer {token}");

        var response = await _client.ExecuteGetAsync<OsuUser>(request);

        return response.StatusCode switch
        {
            HttpStatusCode.OK => new Result<OsuUser>(response.Data),
            HttpStatusCode.Unauthorized => new Result<OsuUser>(HttpStatusCode.Unauthorized, null),
            _ => new Result<OsuUser>(response.StatusCode, "An error occured on osu! user request")
        };
    }

    public async Task<Result<TokenResponse>> RefreshToken(string refreshToken)
    {
        var config = _mapper.Map<RefreshTokenRequest>(_config);
        config.RefreshToken = refreshToken;
        var request = new RestRequest(_apiTokenLink)
            .AddJsonBody(config);
        var response = await _client.ExecutePostAsync<TokenResponse>(request);

        return response.IsSuccessful
            ? new Result<TokenResponse>(response.Data)
            : new Result<TokenResponse>(response.StatusCode, "Could not refresh token");
    }
}
