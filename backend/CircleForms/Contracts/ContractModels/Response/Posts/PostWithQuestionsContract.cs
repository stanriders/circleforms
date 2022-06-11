using System.Collections.Generic;
using CircleForms.Database.Models.Posts.Questions;
using CircleForms.Database.Models.Posts.Questions.Submissions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response.Posts;

public class PostWithQuestionsContract : MinimalPostContract
{
    [JsonProperty("allow_answer_edit")]
    public bool AllowAnswerEdit { get; set; }

    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }
}
