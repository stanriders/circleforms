using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CircleForms.Models;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.V1.ContractModels.Request;

public class PostRequestContract
{
    [Required]
    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("accessibility")]
    public Accessibility Accessibility { get; set; }

    [JsonProperty("limitations")]
    public Limitations Limitations { get; set; }

    [Required]
    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }
}

