using Newtonsoft.Json;

namespace CircleForms.Models.Posts;

public class AnswerContract
{
    [JsonProperty("question_id")]
    public int QuestionId { get; set; }

    [JsonProperty("user_id")]
    public long UserId { get; set; }

    [JsonProperty("answer")]
    public string Result { get; set; }
}
