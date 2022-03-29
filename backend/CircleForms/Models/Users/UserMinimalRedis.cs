using System;
using Newtonsoft.Json;

namespace CircleForms.Models.Users;

public class UserMinimalRedis
{
    [JsonProperty("avatar_url")]
    public Uri AvatarUrl { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; }
}
