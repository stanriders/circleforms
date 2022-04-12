using System;
using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace CircleForms.ExternalAPI.OsuApi.Contracts;

public class UserBadge
{
    [JsonProperty("awarded_at")]
    public DateTime AwardedAt { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("image_url")]
    public string ImageUrl { get; set; }

    [JsonProperty("url")]
    public string Url { get; set; }
}

public class ProfileBanner
{
    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("tournament_id")]
    public int TournamentId { get; set; }

    [JsonProperty("image")]
    public string Image { get; set; }
}

public class Kudosu
{
    [JsonProperty("total")]
    public int Total { get; set; }

    [JsonProperty("available")]
    public int Available { get; set; }
}

public class Country
{
    [JsonProperty("code")]
    public string Code { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }
}

public class Cover
{
    [JsonProperty("custom_url")]
    public string CustomUrl { get; set; }

    [JsonProperty("url")]
    public string Url { get; set; }

    [JsonProperty("id")]
    public object Id { get; set; }
}

public class AccountHistory
{
    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("length")]
    public int Length { get; set; }

    [JsonProperty("timestamp")]
    public DateTime Timestamp { get; set; }

    [JsonProperty("type")]
    public string Type { get; set; }
}

public class MonthlyPlaycount
{
    [JsonProperty("start_date")]
    public DateTime StartDate { get; set; }

    [JsonProperty("count")]
    public int Count { get; set; }
}

public class Page
{
    [JsonProperty("html")]
    public string Html { get; set; }

    [JsonProperty("raw")]
    public string Raw { get; set; }
}

public class ReplaysWatchedCount
{
    [JsonProperty("start_date")]
    public string StartDate { get; set; }

    [JsonProperty("count")]
    public int Count { get; set; }
}

public class Level
{
    [JsonProperty("current")]
    public int Current { get; set; }

    [JsonProperty("progress")]
    public int Progress { get; set; }
}

public class GradeCounts
{
    [JsonProperty("ss")]
    public int Ss { get; set; }

    [JsonProperty("ssh")]
    public int Ssh { get; set; }

    [JsonProperty("s")]
    public int S { get; set; }

    [JsonProperty("sh")]
    public int Sh { get; set; }

    [JsonProperty("a")]
    public int A { get; set; }
}

public class Rank
{
    [JsonProperty("country")]
    public int Country { get; set; }
}

public class Statistics
{
    [JsonProperty("level")]
    public Level Level { get; set; }

    [JsonProperty("global_rank")]
    public int GlobalRank { get; set; }

    [JsonProperty("pp")]
    public double Pp { get; set; }

    [JsonProperty("ranked_score")]
    public long RankedScore { get; set; }

    [JsonProperty("hit_accuracy")]
    public double HitAccuracy { get; set; }

    [JsonProperty("play_count")]
    public int PlayCount { get; set; }

    [JsonProperty("play_time")]
    public int PlayTime { get; set; }

    [JsonProperty("total_score")]
    public long TotalScore { get; set; }

    [JsonProperty("total_hits")]
    public int TotalHits { get; set; }

    [JsonProperty("maximum_combo")]
    public int MaximumCombo { get; set; }

    [JsonProperty("replays_watched_by_others")]
    public int ReplaysWatchedByOthers { get; set; }

    [JsonProperty("is_ranked")]
    public bool IsRanked { get; set; }

    [JsonProperty("grade_counts")]
    public GradeCounts GradeCounts { get; set; }

    [JsonProperty("country_rank")]
    public int CountryRank { get; set; }

    [JsonProperty("rank")]
    public Rank Rank { get; set; }
}

public class UserAchievement
{
    [JsonProperty("achieved_at")]
    public DateTime AchievedAt { get; set; }

    [JsonProperty("achievement_id")]
    public int AchievementId { get; set; }
}

public class RankHistory
{
    [JsonProperty("mode")]
    public string Mode { get; set; }

    [JsonProperty("data")]
    public List<int> Data { get; set; }
}

public class OsuUser
{
    [JsonProperty("avatar_url")]
    public string AvatarUrl { get; set; }

    [JsonProperty("country_code")]
    public string CountryCode { get; set; }

    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("is_active")]
    public bool IsActive { get; set; }

    [JsonProperty("is_bot")]
    [BsonIgnore]
    public bool IsBot { get; set; }

    [JsonProperty("is_deleted")]
    [BsonIgnore]
    public bool IsDeleted { get; set; }

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

    [JsonProperty("is_restricted")]
    [BsonIgnore]
    public bool IsRestricted { get; set; }

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

    [JsonProperty("statistics")]
    public Statistics Statistics { get; set; }

    [JsonProperty("rank_history")]
    public RankHistory RankHistory { get; set; }

    [JsonProperty("ranked_and_approved_beatmapset_count")]
    public int RankedAndApprovedBeatmapsetCount { get; set; }
}
