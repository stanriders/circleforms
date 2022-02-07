using System;
using System.Threading.Tasks;
using CircleForms.Models.OsuContracts;
using CircleForms.Services.Interfaces;
using RestSharp;

namespace CircleForms.Services.Request;

public class OsuUserProvider : IOsuUserProvider
{
    private const string _apiLink = "https://osu.ppy.sh/api/v2/me";
    private readonly IRestClient _client;

    public OsuUserProvider(IRestClient client)
    {
        client.BaseUrl = new Uri(_apiLink);
        _client = client;
    }

    public async Task<OsuUser> GetUser(string token)
    {
        var request = new RestRequest();
        request.AddHeader("Authorization", $"Bearer {token}");

        return await _client.GetAsync<OsuUser>(request);
    }
}
