using Newtonsoft.Json;

namespace CircleForms.Models.Posts.Questions.Answers;

public class Answer
{
    [JsonProperty("user_id")]
    public long UserId { get; set; }

    [JsonProperty("answer")]
    public string Value { get; set; }
}
