using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace CircleForms.Contracts.V1.ContractModels.Response;

public class UserResponseContract
{
    [JsonProperty("posts")]
    public List<PostMinimalResponseContract> Posts { get; set; }

    [JsonProperty("avatar_url")]
    public Uri AvatarUrl { get; set; }

    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("is_supporter")]
    public bool IsSupporter { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; }

    [JsonProperty("discord")]
    public string Discord { get; set; }

    [JsonProperty("osu_join_date")]
    public DateTime JoinDate { get; set; }

    [JsonProperty("playmode")]
    public string Playmode { get; set; }

    [JsonProperty("country")]
    public Country Country { get; set; }

    [JsonProperty("badges")]
    public List<Badge> Badges { get; set; }

    [JsonProperty("monthly_playcounts")]
    public List<Count> MonthlyPlaycounts { get; set; }

    [JsonProperty("previous_usernames")]
    public List<string> PreviousUsernames { get; set; }

    [JsonProperty("statistics")]
    public Statistics Statistics { get; set; }

    [JsonProperty("rank_history")]
    public RankHistory RankHistory { get; set; }
}

public class Badge
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

public class Count
{
    [JsonProperty("start_date")]
    public DateTime StartDate { get; set; }

    [JsonProperty("count")]
    public long CountCount { get; set; }
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

    [JsonProperty("pp")]
    public long Pp { get; set; }

    [JsonProperty("global_rank")]
    public long GlobalRank { get; set; }

    [JsonProperty("ranked_score")]
    public long RankedScore { get; set; }

    [JsonProperty("hit_accuracy")]
    public double HitAccuracy { get; set; }

    [JsonProperty("play_count")]
    public long PlayCount { get; set; }

    [JsonProperty("play_time")]
    public long PlayTime { get; set; }

    [JsonProperty("total_score")]
    public long TotalScore { get; set; }

    [JsonProperty("total_hits")]
    public long TotalHits { get; set; }

    [JsonProperty("maximum_combo")]
    public long MaximumCombo { get; set; }

    [JsonProperty("replays_watched_by_others")]
    public long ReplaysWatchedByOthers { get; set; }

    [JsonProperty("is_ranked")]
    public bool IsRanked { get; set; }

    [JsonProperty("grade_counts")]
    public GradeCounts GradeCounts { get; set; }

    [JsonProperty("rank")]
    public Rank Rank { get; set; }
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
