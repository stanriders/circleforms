using System.Collections.Generic;
using CircleForms.Database.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class PostWithQuestionsContract : MinimalPostContract
{
    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }
}
