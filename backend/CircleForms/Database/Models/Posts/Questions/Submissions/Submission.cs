using Newtonsoft.Json;

namespace CircleForms.Database.Models.Posts.Questions.Submissions;

public class Submission
{
    [JsonProperty("question_id")]
    public string QuestionId { get; set; }

    [JsonProperty("answers")]
    public string[] Answers { get; set; }
}
