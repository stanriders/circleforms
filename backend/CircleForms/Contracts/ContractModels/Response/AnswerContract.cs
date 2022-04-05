using System.Collections.Generic;
using CircleForms.Models.Posts.Questions.Submissions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class AnswerContract
{
    [JsonProperty("submissions")]
    public List<Submission> Submissions { get; set; }

    [JsonProperty("user")]
    public UserAnswerContract User { get; set; }
}
