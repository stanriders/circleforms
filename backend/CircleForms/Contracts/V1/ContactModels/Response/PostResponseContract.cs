using System;
using System.Collections.Generic;
using CircleForms.Models;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Contracts.V1.ContactModels.Response;

public class PostResponseContract
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("author_id")]
    public string AuthorId { get; set; }

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

    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }

    [JsonProperty("answers")]
    public List<Answer> Answers { get; set; }

    [JsonProperty("publish_time")]
    public DateTime PublishTime { get; set; }
}
