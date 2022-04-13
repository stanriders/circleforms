using Newtonsoft.Json;

namespace CircleForms.Database.Models.Users;

public class UserMinimalRedis
{
    [JsonProperty("id")]
    public string ID { get; set; }

    [JsonProperty("avatar_url")]
    public string AvatarUrl { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; }
}
