using Newtonsoft.Json;

namespace CircleForms.Models.Posts.Questions.Submissions;

public class Submission
{
    [JsonProperty("question_id")]
    public int QuestionId { get; set; }

    [JsonProperty("answer")]
    public string Value { get; set; }
}
