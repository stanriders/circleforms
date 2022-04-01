using System;
using System.Collections.Generic;
using CircleForms.Models;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class PostResponseContract
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("author_id")]
    public string AuthorId { get; set; }

    [JsonProperty("is_active")]
    public bool IsActive { get; set; }

    [JsonProperty("icon")]
    public string Icon { get; set; }

    [JsonProperty("banner")]
    public string Banner { get; set; }

    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("access_key")]
    public string AccessKey { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("excerpt")]
    public string Excerpt { get; set; }

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
}
