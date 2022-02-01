﻿using System;
using CircleForms.Models;
using CircleForms.Models.Enums;
using Newtonsoft.Json;

namespace CircleForms.Contracts.V1.ContractModels.Response;

public class PostMinimalResponseContract
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("author_id")]
    public string AuthorId { get; set; }

    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("publish_time")]
    public DateTime PublishTime { get; set; }

    [JsonProperty("accessibility")]
    public Accessibility Accessibility { get; set; }

    [JsonProperty("limitations")]
    public Limitations Limitations { get; set; }
}