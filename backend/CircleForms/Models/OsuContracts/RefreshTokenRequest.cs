using Newtonsoft.Json;

namespace CircleForms.Models.OsuContracts;

public class RefreshTokenRequest
{
     [JsonProperty("client_id")]
     public int ClientId { get; set; }

     [JsonProperty("client_secret")]
     public string ClientSecret { get; set; }

     [JsonProperty("grant_type")]
     public string GrantType { get; set; } = "refresh_token";

     [JsonProperty("refresh_token")]
     public string RefreshToken { get; set; }
}
