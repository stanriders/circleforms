using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace CircleForms.Contracts.Request;

public class SubmissionContract
{
    [Required]
    [JsonProperty("question_id")]
    public string QuestionId { get; set; }

    [Required]
    [JsonProperty("answers")]
    public string[] Answers { get; set; }
}
