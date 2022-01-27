using System.Collections.Generic;
using CircleForms.Models.Posts.Questions.Submissions;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace CircleForms.Models.Posts;

public class Answer
{
    [BsonId]
    [JsonProperty("user_id")]
    public long UserId { get; set; }

    [JsonProperty("answers")]
    public List<Submission> Submissions { get; set; }
}
