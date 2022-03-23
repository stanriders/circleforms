using System;
using System.Collections.Generic;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts.Questions;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;
using Newtonsoft.Json;

namespace CircleForms.Models.Posts;

public class Post : IEntity
{
    public Post()
    {
        ID = GenerateNewID();
    }

    [JsonProperty("author_id")]
    public string AuthorId { get; set; }

    [JsonProperty("is_active")]
    public bool IsActive { get; set; }

    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("access_key")]
    public string AccessKey { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("accessibility")]
    public Accessibility Accessibility { get; set; }

    [JsonProperty("limitations")]
    public Limitations Limitations { get; set; }

    [JsonProperty("published")]
    public bool Published { get; set; }

    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }

    [JsonProperty("answers")]
    public List<Answer> Answers { get; set; }

    [JsonProperty("publish_time")]
    public DateTime PublishTime { get; set; }

    public string GenerateNewID()
    {
        return ObjectId.GenerateNewId().ToString();
    }

    [ObjectId]
    [BsonId]
    [JsonProperty("id")]
    public string ID { get; set; }
}
