using System;
using System.Text.Json.Serialization;

namespace CircleForms.Models.OAuth
{
    public record OAuthToken
    {
        [JsonPropertyName("access_token")] 
        public string AccessToken { get; init; }

        [JsonPropertyName("expires_in")] 
        public int ExpiresIn { get; init; }
        
        [JsonPropertyName("refresh_token")] 
        public string RefreshToken { get; init; }

        [JsonPropertyName("token_type")] 
        public string TokenType { get; init; }
    }
}