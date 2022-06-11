
using CircleForms.ExternalAPI.OsuApi.Contracts;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response.Users;

public class UserContract
{
    [JsonProperty("id")]
    public string ID { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("osu")]
    public OsuUser Osu { get; set; }
}
