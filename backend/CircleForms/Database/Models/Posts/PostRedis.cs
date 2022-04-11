using System;
using System.Collections.Generic;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Database.Models.Posts;

public class PostRedis
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("is_active")]
    public bool IsActive { get; set; }

    [JsonProperty("author_id")]
    public string AuthorId { get; set; }

    [JsonProperty("icon")]
    public string Icon { get; set; }

    [JsonProperty("banner")]
    public string Banner { get; set; }

    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("excerpt")]
    public string Excerpt { get; set; }

    [JsonProperty("publish_time")]
    public DateTime PublishTime { get; set; }

    [JsonProperty("accessibility")]
    public Accessibility Accessibility { get; set; }

    [JsonProperty("limitations")]
    public Limitations Limitations { get; set; }

    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }

    [JsonIgnore]
    public int AnswerCount { get; set; }
}
