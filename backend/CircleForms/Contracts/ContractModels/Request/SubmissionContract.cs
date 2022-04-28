using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Request;

public class SubmissionContract
{
    [Required]
    [JsonProperty("question_id")]
    public string QuestionId { get; set; }

    [Required]
    [JsonProperty("answer")]
    public string Answer { get; set; }
}
