using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CircleForms.Models;
using CircleForms.Models.Enums;
using Newtonsoft.Json;

namespace CircleForms.Contracts.V1.ContractModels.Request;

public class PostUpdateRequestContract
{
    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("accessibility")]
    public Accessibility? Accessibility { get; set; }

    [JsonProperty("limitations")]
    public Limitations Limitations { get; set; }
}
