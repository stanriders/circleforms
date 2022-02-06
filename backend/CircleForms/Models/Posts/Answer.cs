using System.Collections.Generic;
using CircleForms.Models.Posts.Questions.Submissions;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;
using Newtonsoft.Json;

namespace CircleForms.Models.Posts;

public class Answer : IEntity
{
    [JsonProperty("answers")]
    public List<Submission> Submissions { get; set; }

    [BsonId]
    [JsonProperty("user_id")]
    public string ID { get; set; }

    public string GenerateNewID()
    {
        return "";
    }
}
