using System.ComponentModel.DataAnnotations;
using CircleForms.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.V1.ContractModels.Request;

public class SubmissionContract
{
    [Required]
    [JsonProperty("question_id")]
    public int QuestionId { get; set; }

    [Required]
    [JsonProperty("question_type")]
    public QuestionType QuestionType { get; set; }

    [Required]
    [JsonProperty("answer")]
    public string Answer { get; set; }
}
