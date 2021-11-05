using System;
using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Models.OAuth;
using CircleForms.Services.Interfaces;
using RestSharp;

namespace CircleForms.Services
{
    public class MeService : IMeService
    {
        private const string ApiLink = "https://osu.ppy.sh/api/v2/me";
        private readonly IRestClient _client;

        public MeService(IRestClient client)
        {
            client.BaseUrl = new Uri(ApiLink);
            _client = client;
        }

        public async Task<User> GetUser(OAuthToken token)
        {
            var request = new RestRequest();
            request.AddHeader("Authorization", $"{token.TokenType} {token.AccessToken}");

            return await _client.GetAsync<User>(request);
        }
    }
}
