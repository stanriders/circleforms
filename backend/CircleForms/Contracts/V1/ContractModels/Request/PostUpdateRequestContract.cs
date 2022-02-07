using CircleForms.Models;
using Newtonsoft.Json;

namespace CircleForms.Contracts.V1.ContractModels.Request;

public class PostUpdateRequestContract
{
    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("limitations")]
    public Limitations Limitations { get; set; }
}
