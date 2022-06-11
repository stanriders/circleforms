using System.Collections.Generic;
using CircleForms.Database.Models.Posts.Questions.Submissions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response.Compound.Abstract;

public class AnswerPostCompound<T>
{
    [JsonProperty("answer")]
    public List<Submission> Answer { get; set; }

    [JsonProperty("post")]
    public T Post { get; set; }
}
