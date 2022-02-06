using System.Collections.Generic;
using CircleForms.Models.Posts.Questions.Submissions;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;
using Newtonsoft.Json;

namespace CircleForms.Models.Posts;

public class Answer : Entity
{
    [BsonId]
    [JsonProperty("user_id")]
    public string UserId { get; set; }

    [JsonProperty("answers")]
    public List<Submission> Submissions { get; set; }
}
