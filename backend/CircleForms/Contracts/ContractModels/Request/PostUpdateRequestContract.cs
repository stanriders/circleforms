using System.Collections.Generic;
using CircleForms.Models;
using CircleForms.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Request;

public class PostUpdateRequestContract
{
    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("limitations")]
    public Limitations Limitations { get; set; }

    [JsonProperty("questions")]
    public List<QuestionUpdateContract> Questions { get; set; }
}

public class QuestionUpdateContract
{
    [JsonProperty("id")]
    public int? Id { get; set; }

    [JsonProperty("delete")]
    public bool Delete { get; set; }

    [JsonProperty("type")]
    public QuestionType QuestionType { get; set; }

    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("is_optional")]
    public bool Optional { get; set; }

    [JsonProperty("question_info")]
    public List<string> QuestionInfo { get; set; }
}
