using System;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class UserMinimalResponseContract
{
    [JsonProperty("avatar_url")]
    public Uri AvatarUrl { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; }
}
