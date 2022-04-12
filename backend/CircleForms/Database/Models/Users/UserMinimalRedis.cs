using Newtonsoft.Json;

namespace CircleForms.Database.Models.Users;

public class UserMinimalRedis
{
    [JsonProperty("avatar_url")]
    public string AvatarUrl { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; }
}
