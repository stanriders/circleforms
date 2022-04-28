using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class UserMinimalResponseContract
{
    [JsonProperty]
    public string ID { get; set; }

    [JsonProperty("avatar_url")]
    public string AvatarUrl { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; }
}
