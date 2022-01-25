using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace CircleForms.Models.Posts;

public class PostRedis
{
    public static PostRedis FromPost(Post post)
    {
        return new PostRedis
        {
            Id = post.Id.ToString(),
            AuthorId = post.AuthorId,
            Title = post.Title,
            Description = post.Description,
            PublishTime = post.PublishTime
        };
    }
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("author_id")]
    public long AuthorId { get; set; }

    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("publish_time")]
    public DateTime PublishTime { get; set; }
}
