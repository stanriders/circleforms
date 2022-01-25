using System;
using System.Collections.Generic;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts.PostFields;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

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
    public ObjectId Id { get; set; }

    [JsonProperty("author_id")]
    public long AuthorId { get; set; }

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

    [JsonProperty("fields")]
    public List<PostField> Fields { get; set; }

    [JsonProperty("publish_time")]
    public DateTime PublishTime { get; set; }
}
