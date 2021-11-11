using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace CircleForms.Models.OAuth
{
    public record OAuthToken
    {
        [BsonElement("Token")]
        [JsonPropertyName("access_token")]
        public string AccessToken { get; init; }

        [BsonElement("ExpiresIn")]
        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; init; }

        [BsonElement("RefreshToken")]
        [JsonPropertyName("refresh_token")]
        public string RefreshToken { get; init; }

        [JsonPropertyName("token_type")]
        public string TokenType { get; init; }
    }
}
