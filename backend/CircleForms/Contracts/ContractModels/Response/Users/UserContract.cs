
using System;
using System.Collections.Generic;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response.Users;

public class UserContract
{
    [JsonProperty("id")]
    public string ID { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("osu")]
    public OsuUser Osu { get; set; }
}

public class OsuUserContract
{
    [JsonProperty("avatar_url")]
    public string AvatarUrl { get; set; }

    [JsonProperty("country_code")]
    public string CountryCode { get; set; }

    [JsonProperty("is_active")]
    public bool IsActive { get; set; }

    [JsonProperty("is_supporter")]
    public bool IsSupporter { get; set; }

    [JsonProperty("last_visit")]
    public DateTime LastVisit { get; set; }

    [JsonProperty("pm_friends_only")]
    public bool PmFriendsOnly { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("join_date")]
    public DateTime JoinDate { get; set; }

    [JsonProperty("kudosu")]
    public Kudosu Kudosu { get; set; }

    [JsonProperty("playmode")]
    public string Playmode { get; set; }

    [JsonProperty("playstyle")]
    public List<string> Playstyle { get; set; }

    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("title_url")]
    public string TitleUrl { get; set; }

    [JsonProperty("account_history")]
    public List<AccountHistory> AccountHistory { get; set; }

    [JsonProperty("badges")]
    public List<UserBadge> Badges { get; set; }

    [JsonProperty("follower_count")]
    public int FollowerCount { get; set; }

    [JsonProperty("loved_beatmapset_count")]
    public int LovedBeatmapsetCount { get; set; }

    [JsonProperty("monthly_playcounts")]
    public List<MonthlyPlaycount> MonthlyPlaycounts { get; set; }

    [JsonProperty("previous_usernames")]
    public List<string> PreviousUsernames { get; set; }

    [JsonProperty("ranked_beatmapset_count")]
    public int RankedBeatmapsetCount { get; set; }

    [JsonProperty("statistics_rulesets")]
    public StatisticsRulesets Statistics { get; set; }

    [JsonProperty("rank_history")]
    public RankHistory RankHistory { get; set; }

    [JsonProperty("ranked_and_approved_beatmapset_count")]
    public int RankedAndApprovedBeatmapsetCount { get; set; }
}
