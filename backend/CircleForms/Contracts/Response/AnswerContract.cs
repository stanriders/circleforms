using System.Collections.Generic;
using CircleForms.Database.Models.Posts.Questions.Submissions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.Response;

public class AnswerContract
{
    [JsonProperty("submissions")]
    public List<Submission> Submissions { get; set; }

    [JsonProperty("user")]
    public string UserId { get; set; }
}
