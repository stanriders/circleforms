using System.Collections.Generic;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response.Users;

public class UserContract
{
    [JsonProperty("id")]
    public string ID { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("osu")]
    public Dictionary<string, object> Osu { get; set; }
}
