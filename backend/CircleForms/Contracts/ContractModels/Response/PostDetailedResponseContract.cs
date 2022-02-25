using System.Collections.Generic;
using CircleForms.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class PostDetailedResponseContract : PostMinimalResponseContract
{
    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }
}
