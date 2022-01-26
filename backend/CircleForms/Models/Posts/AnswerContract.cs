using Newtonsoft.Json;

namespace CircleForms.Models.Posts;

public class AnswerContract
{
    [JsonProperty("question_id")]
    public int QuestionId { get; set; }

    [JsonProperty("answer")]
    public string Answer { get; set; }
}
