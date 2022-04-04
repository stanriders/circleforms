using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class UserAnswerContract
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("avatar_url")]
    public Uri AvatarUrl { get; set; }

    [JsonProperty("country_code")]
    public string CountryCode { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("osu_join_date")]
    public DateTime JoinDate { get; set; }

    [JsonProperty("badges")]
    public List<UserBadge> Badges { get; set; }

    [JsonProperty("statistics")]
    public Statistics Statistics { get; set; }
}
