using System.Collections.Generic;
using CircleForms.Database.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.Response.Posts;

public class PostContract : MinimalPostContract
{
    [JsonProperty("access_key")]
    public string AccessKey { get; set; }

    [JsonProperty("allow_answer_edit")]
    public bool AllowAnswerEdit { get; set; }

    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }
}
