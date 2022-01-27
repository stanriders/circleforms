using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace CircleForms.Models.Posts;

public class SubmissionContract
{
    [Required]
    [JsonProperty("question_id")]
    public int QuestionId { get; set; }

    [Required]
    [JsonProperty("answer")]
    public string Answer { get; set; }
}
