using Newtonsoft.Json;

namespace CircleForms.Database.Models.Posts.Questions.Submissions;

public class Submission
{
    [JsonProperty("question_id")]
    public string QuestionId { get; set; }

    [JsonProperty("answer")]
    public string Answer { get; set; }
}
