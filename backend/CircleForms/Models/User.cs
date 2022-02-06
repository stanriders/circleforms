using System;
using System.Collections.Generic;
using CircleForms.Models.Posts;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;
using Newtonsoft.Json;

namespace CircleForms.Models;

[Collection("users")]
public class User : IEntity
{
    [JsonProperty("posts")]
    public List<Post> Posts { get; set; }

    [JsonProperty("avatar_url")]
    public Uri AvatarUrl { get; set; }

    [JsonProperty("country_code")]
    public string CountryCode { get; set; }

    [JsonProperty("default_group")]
    public string DefaultGroup { get; set; }

    [JsonProperty("is_active")]
    public bool IsActive { get; set; }

    [JsonProperty("is_bot")]
    public bool IsBot { get; set; }

    [JsonProperty("is_supporter")]
    public bool IsSupporter { get; set; }

    [JsonProperty("pm_friends_only")]
    public bool PmFriendsOnly { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("join_date")]
    public DateTime JoinDate { get; set; }

    [JsonProperty("playmode")]
    public string Playmode { get; set; }

    [JsonProperty("country")]
    public Country Country { get; set; }

    [JsonProperty("is_restricted")]
    public bool IsRestricted { get; set; }

    [JsonProperty("account_history")]
    public List<AccountHistory> AccountHistory { get; set; }

    [JsonProperty("badges")]
    public List<UserBadge> Badges { get; set; }

    [JsonProperty("monthly_playcounts")]
    public List<MonthlyPlaycount> MonthlyPlaycounts { get; set; }

    [JsonProperty("previous_usernames")]
    public List<string> PreviousUsernames { get; set; }

    [JsonProperty("statistics")]
    public Statistics Statistics { get; set; }

    // [JsonProperty("user_achievements")]
    // public List<UserAchievement> UserAchievements { get; set; }

    [JsonProperty("rank_history")]
    public RankHistory RankHistory { get; set; }

    [JsonIgnore]
    public Roles Roles { get; set; }

    public string GenerateNewID()
    {
        return "000000";
    }

    [BsonId]
    [JsonProperty("id")]
    public string ID { get; set; }
}

[Flags]
public enum Roles
{
    User,
    Admin,
    Moderator,
    SuperAdmin
}

public class UserBadge
{
    [JsonProperty("awarded_at")]
    public DateTime AwardedAt { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("image_url")]
    public Uri ImageUrl { get; set; }

    [JsonProperty("url")]
    public string Url { get; set; }
}

public class Country
{
    [JsonProperty("code")]
    public string Code { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }
}

public class MonthlyPlaycount
{
    [JsonProperty("start_date")]
    public DateTime StartDate { get; set; }

    [JsonProperty("count")]
    public int Count { get; set; }
}

public class RankHistory
{
    [JsonProperty("mode")]
    public string Mode { get; set; }

    [JsonProperty("data")]
    public List<long> Data { get; set; }
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
}

public class GradeCounts
{
    [JsonProperty("ss")]
    public long Ss { get; set; }

    [JsonProperty("ssh")]
    public long Ssh { get; set; }

    [JsonProperty("s")]
    public long S { get; set; }

    [JsonProperty("sh")]
    public long Sh { get; set; }

    [JsonProperty("a")]
    public long A { get; set; }
}

public class Level
{
    [JsonProperty("current")]
    public long Current { get; set; }

    [JsonProperty("progress")]
    public long Progress { get; set; }
}

public class Rank
{
    [JsonProperty("global")]
    public long Global { get; set; }

    [JsonProperty("country")]
    public long Country { get; set; }
}

public class UserAchievement
{
    [JsonProperty("achieved_at")]
    public DateTime AchievedAt { get; set; }

    [JsonProperty("achievement_id")]
    public long AchievementId { get; set; }
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
