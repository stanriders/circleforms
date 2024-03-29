﻿using System;
using System.Collections.Generic;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Posts.Questions;
using Newtonsoft.Json;

namespace CircleForms.Database.Models.Posts;

public class PostRedis
{
    [JsonProperty("id")]
    public string ID { get; set; }

    [JsonProperty("active_to")]
    public DateTime ActiveTo { get; set; }

    [JsonIgnore]
    public bool IsActive => DateTime.UtcNow < ActiveTo;

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

    [JsonProperty("gamemode")]
    public Gamemode Gamemode { get; set; }

    [JsonProperty("accessibility")]
    public Accessibility Accessibility { get; set; }

    [JsonProperty("limitations")]
    public Limitations Limitations { get; set; }

    [JsonProperty("allow_answer_edit")]
    public bool AllowAnswerEdit { get; set; }

    [JsonProperty("questions")]
    public List<Question> Questions { get; set; }

    [JsonIgnore]
    public int AnswerCount { get; set; }
}
