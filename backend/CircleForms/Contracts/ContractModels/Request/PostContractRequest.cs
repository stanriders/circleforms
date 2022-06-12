using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Request;

public class PostContractRequest
{
    [Required]
    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("excerpt")]
    public string Excerpt { get; set; }

    [JsonProperty("gamemode")]
    public Gamemode Gamemode { get; set; }

    [JsonProperty("accessibility")]
    public Accessibility Accessibility { get; set; }

    [JsonProperty("limitations")]
    public Limitations Limitations { get; set; }

    [JsonProperty("active_to")]
    public DateTime ActiveTo { get; set; }

    [JsonProperty("allow_answer_edit")]
    public bool AllowAnswerEdit { get; set; }

    [Required]
    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }
}
