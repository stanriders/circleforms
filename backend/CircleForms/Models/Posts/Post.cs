using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts.Questions;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;

namespace CircleForms.Models.Posts;

public class Post
{
    public Post()
    {
        Id = ObjectId.GenerateNewId();
    }

    public Post(string id)
    {
        Id = ObjectId.Parse(id);
    }

    [BsonId]
    [JsonProperty("id")]
    [SwaggerSchema(ReadOnly = true)]
    public ObjectId Id { get; set; }

    [JsonProperty("author_id")]
    [SwaggerSchema(ReadOnly = true)]
    public long AuthorId { get; set; }

    [Required]
    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("accessibility")]
    public Accessibility Accessibility { get; set; }

    [JsonProperty("limitations")]
    public Limitations Limitations { get; set; }

    [JsonProperty("published")]
    public bool Published { get; set; }

    [Required]
    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }

    [JsonProperty("answers")]
    [SwaggerSchema(ReadOnly = true)]
    public List<Answer> Answers { get; set; }

    [JsonProperty("publish_time")]
    [SwaggerSchema(ReadOnly = true)]
    public DateTime PublishTime { get; set; }
}
