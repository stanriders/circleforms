using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class OsuUserStatisticsContract
{
    [JsonProperty("statistics")]
    public object Statistics { get; set; }

    [JsonProperty("country_code")]
    public object CountryCode { get; set; }
}
