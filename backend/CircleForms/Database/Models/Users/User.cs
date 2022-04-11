using System;
using System.Collections.Generic;
using CircleForms.Database.Models.Posts;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;

namespace CircleForms.Database.Models.Users;

[Collection("users")]
public class User : IEntity
{
    public User()
    {
        this.InitOneToMany(() => PostsRelation);
        this.InitOneToMany(() => AnswerRelation);
    }

    public TokenResponse Token { get; set; }
    public Many<Post> PostsRelation { get; set; }
    public Many<Answer> AnswerRelation { get; set; }

    public Uri AvatarUrl { get; set; }

    public string CountryCode { get; set; }

    public string DefaultGroup { get; set; }

    public bool IsActive { get; set; }

    public bool IsBot { get; set; }

    public bool IsSupporter { get; set; }

    public bool PmFriendsOnly { get; set; }

    public string Username { get; set; }

    public string Discord { get; set; }

    public DateTime JoinDate { get; set; }

    public string Playmode { get; set; }

    public bool IsRestricted { get; set; }

    public List<AccountHistory> AccountHistory { get; set; }

    public List<UserBadge> Badges { get; set; }

    public List<MonthlyPlaycount> MonthlyPlaycounts { get; set; }

    public List<string> PreviousUsernames { get; set; }

    public Statistics Statistics { get; set; }

    // public List<UserAchievement> UserAchievements { get; set; }

    public RankHistory RankHistory { get; set; }

    public Roles Roles { get; set; }

    public string GenerateNewID()
    {
        return "000000";
    }

    [BsonId]
    public string ID { get; set; }
}

[Flags]
public enum Roles
{
    User = 0,
    Admin = 1,
    Moderator = 2,
    SuperAdmin = 4
}

public class UserBadge
{
    public DateTime AwardedAt { get; set; }

    public string Description { get; set; }

    public Uri ImageUrl { get; set; }

    public string Url { get; set; }
}

public class MonthlyPlaycount
{
    public DateTime StartDate { get; set; }

    public int Count { get; set; }
}

public class RankHistory
{
    public string Mode { get; set; }

    public List<long> Data { get; set; }
}

public class Statistics
{
    public Level Level { get; set; }

    public int GlobalRank { get; set; }

    public double Pp { get; set; }

    public long RankedScore { get; set; }

    public double HitAccuracy { get; set; }

    public int PlayCount { get; set; }

    public int PlayTime { get; set; }

    public long TotalScore { get; set; }

    public int TotalHits { get; set; }

    public int MaximumCombo { get; set; }

    public int ReplaysWatchedByOthers { get; set; }

    public bool IsRanked { get; set; }

    public GradeCounts GradeCounts { get; set; }

    public int CountryRank { get; set; }
}

public class GradeCounts
{
    public long Ss { get; set; }

    public long Ssh { get; set; }

    public long S { get; set; }

    public long Sh { get; set; }

    public long A { get; set; }
}

public class Level
{
    public long Current { get; set; }

    public long Progress { get; set; }
}

public class UserAchievement
{
    public DateTime AchievedAt { get; set; }

    public long AchievementId { get; set; }
}

public class AccountHistory
{
    public string Description { get; set; }

    public int Id { get; set; }

    public int Length { get; set; }

    public DateTime Timestamp { get; set; }

    public string Type { get; set; }
}
