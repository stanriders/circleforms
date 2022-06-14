using System.Collections.Generic;
using CircleForms.Contracts.Response.Posts;
using CircleForms.Database.Models.Posts.Questions.Submissions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.Response.Compound;

public class AnswerPostContract
{
    [JsonProperty("answer")]
    public List<Submission> Answer { get; set; }

    [JsonProperty("post")]
    public PostContract Post { get; set; }
}
