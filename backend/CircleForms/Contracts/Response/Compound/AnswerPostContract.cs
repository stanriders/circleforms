using CircleForms.Contracts.Response.Posts;
using Newtonsoft.Json;

namespace CircleForms.Contracts.Response.Compound;

public class AnswerPostContract
{
    [JsonProperty("answer")]
    public AnswerContract Answer { get; set; }

    [JsonProperty("post")]
    public PostContract Post { get; set; }
}
