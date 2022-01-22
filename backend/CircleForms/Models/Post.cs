using System;
using System.Collections.Generic;
using CircleForms.Models.Enums;
using CircleForms.Models.PostFields;
using Newtonsoft.Json;

namespace CircleForms.Models;

public class Post
{
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
