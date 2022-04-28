using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class UserAnswerContract
{
    [JsonProperty("id")]
    public string ID { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("osu")]
    public OsuAnswerContract Osu { get; set; }
}

public class OsuAnswerContract
{
    public string AvatarUrl { get; set; }
    public string Username { get; set; }
    public object Statistics { get; set; }
    public object CountryCode { get; set; }
}
