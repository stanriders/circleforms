using System.Collections.Generic;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class UserResponseContract
{
    [JsonProperty("id")]
    public string ID { get; set; }

    [JsonProperty("posts")]
    public List<PostMinimalResponseContract> Posts { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("osu")]
    public object Osu { get; set; }
}
