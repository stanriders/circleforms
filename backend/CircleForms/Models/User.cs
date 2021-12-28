using System;
using System.Collections.Generic;
using CircleForms.Models.OAuth;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace CircleForms.Models
{
    public class User
    {
        [BsonElement("token")]
        [JsonProperty("token")]
        public OAuthToken Token { get; set; }

        [JsonProperty("posts")]
        public IList<Post> Posts { get; set; }

        [BsonIgnore]
        [JsonProperty("avatar_url")]
        public Uri AvatarUrl { get; set; }

        [BsonIgnore]
        [JsonProperty("country_code")]
        public string CountryCode { get; set; }

        [BsonIgnore]
        [JsonProperty("default_group")]
        public string DefaultGroup { get; set; }

        [BsonId]
        [JsonProperty("id")]
        public long Id { get; set; }

        [BsonIgnore]
        [JsonProperty("is_active")]
        public bool IsActive { get; set; }

        [BsonIgnore]
        [JsonProperty("is_bot")]
        public bool IsBot { get; set; }

        [BsonIgnore]
        [JsonProperty("is_deleted")]
        public bool IsDeleted { get; set; }

        [BsonIgnore]
        [JsonProperty("is_online")]
        public bool IsOnline { get; set; }

        [BsonIgnore]
        [JsonProperty("is_supporter")]
        public bool IsSupporter { get; set; }

        [BsonIgnore]
        [JsonProperty("last_visit")]
        public DateTimeOffset LastVisit { get; set; }

        [BsonIgnore]
        [JsonProperty("pm_friends_only")]
        public bool PmFriendsOnly { get; set; }

        [BsonIgnore]
        [JsonProperty("profile_colour")]
        public string ProfileColour { get; set; }

        [JsonProperty("username")]
        public string Username { get; set; }

        [BsonIgnore]
        [JsonProperty("cover_url")]
        public Uri CoverUrl { get; set; }

        [BsonElement("Discord")]
        [JsonProperty("discord")]
        public string Discord { get; set; }

        [BsonIgnore]
        [JsonProperty("has_supported")]
        public bool HasSupported { get; set; }

        [BsonIgnore]
        [JsonProperty("interests")]
        public object Interests { get; set; }

        [BsonIgnore]
        [JsonProperty("join_date")]
        public DateTimeOffset JoinDate { get; set; }

        [BsonIgnore]
        [JsonProperty("kudosu")]
        public Kudosu Kudosu { get; set; }

        [BsonIgnore]
        [JsonProperty("location")]
        public object Location { get; set; }

        [BsonIgnore]
        [JsonProperty("max_blocks")]
        public long MaxBlocks { get; set; }

        [BsonIgnore]
        [JsonProperty("max_friends")]
        public long MaxFriends { get; set; }

        [BsonIgnore]
        [JsonProperty("occupation")]
        public object Occupation { get; set; }

        [BsonIgnore]
        [JsonProperty("playmode")]
        public string Playmode { get; set; }

        [BsonIgnore]
        [JsonProperty("playstyle")]
        public List<string> Playstyle { get; set; }

        [BsonIgnore]
        [JsonProperty("post_count")]
        public long PostCount { get; set; }

        [BsonIgnore]
        [JsonProperty("profile_order")]
        public List<string> ProfileOrder { get; set; }

        [BsonIgnore]
        [JsonProperty("title")]
        public string Title { get; set; }

        [BsonIgnore]
        [JsonProperty("twitter")]
        public string Twitter { get; set; }

        [BsonIgnore]
        [JsonProperty("website")]
        public Uri Website { get; set; }

        [BsonIgnore]
        [JsonProperty("country")]
        public Country Country { get; set; }

        [BsonIgnore]
        [JsonProperty("cover")]
        public Cover Cover { get; set; }

        [BsonIgnore]
        [JsonProperty("is_restricted")]
        public bool IsRestricted { get; set; }

        [BsonIgnore]
        [JsonProperty("account_history")]
        public List<object> AccountHistory { get; set; }

        [BsonIgnore]
        [JsonProperty("active_tournament_banner")]
        public object ActiveTournamentBanner { get; set; }

        [BsonIgnore]
        [JsonProperty("badges")]
        public List<Badge> Badges { get; set; }

        [BsonIgnore]
        [JsonProperty("favourite_beatmapset_count")]
        public long FavouriteBeatmapsetCount { get; set; }

        [BsonIgnore]
        [JsonProperty("follower_count")]
        public long FollowerCount { get; set; }

        [BsonIgnore]
        [JsonProperty("graveyard_beatmapset_count")]
        public long GraveyardBeatmapsetCount { get; set; }

        [BsonIgnore]
        [JsonProperty("groups")]
        public List<Group> Groups { get; set; }

        [BsonIgnore]
        [JsonProperty("loved_beatmapset_count")]
        public long LovedBeatmapsetCount { get; set; }

        [BsonIgnore]
        [JsonProperty("monthly_playcounts")]
        public List<Count> MonthlyPlaycounts { get; set; }

        [BsonIgnore]
        [JsonProperty("page")]
        public Page Page { get; set; }

        [BsonIgnore]
        [JsonProperty("pending_beatmapset_count")]
        public long PendingBeatmapsetCount { get; set; }

        [BsonIgnore]
        [JsonProperty("previous_usernames")]
        public List<string> PreviousUsernames { get; set; }

        [BsonIgnore]
        [JsonProperty("ranked_beatmapset_count")]
        public long RankedBeatmapsetCount { get; set; }

        [BsonIgnore]
        [JsonProperty("replays_watched_counts")]
        public List<Count> ReplaysWatchedCounts { get; set; }

        [BsonIgnore]
        [JsonProperty("scores_first_count")]
        public long ScoresFirstCount { get; set; }

        [BsonIgnore]
        [JsonProperty("statistics")]
        public Statistics Statistics { get; set; }

        [BsonIgnore]
        [JsonProperty("support_level")]
        public long SupportLevel { get; set; }

        [BsonIgnore]
        [JsonProperty("user_achievements")]
        public List<UserAchievement> UserAchievements { get; set; }

        [BsonIgnore]
        [JsonProperty("rank_history")]
        public RankHistory RankHistory { get; set; }
    }

    public class Badge
    {
        [JsonProperty("awarded_at")]
        public DateTimeOffset AwardedAt { get; set; }

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

    public class Cover
    {
        [JsonProperty("custom_url")]
        public Uri CustomUrl { get; set; }

        [JsonProperty("url")]
        public Uri Url { get; set; }

        [JsonProperty("id")]
        public object Id { get; set; }
    }

    public class Group
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("identifier")]
        public string Identifier { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("short_name")]
        public string ShortName { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("colour")]
        public string Colour { get; set; }
    }

    public class Kudosu
    {
        [JsonProperty("total")]
        public long Total { get; set; }

        [JsonProperty("available")]
        public long Available { get; set; }
    }

    public class Count
    {
        [JsonProperty("start_date")]
        public DateTimeOffset StartDate { get; set; }

        [JsonProperty("count")]
        public long CountCount { get; set; }
    }

    public class Page
    {
        [JsonProperty("html")]
        public string Html { get; set; }

        [JsonProperty("raw")]
        public string Raw { get; set; }
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

    public class UserAchievement
    {
        [JsonProperty("achieved_at")]
        public DateTimeOffset AchievedAt { get; set; }

        [JsonProperty("achievement_id")]
        public long AchievementId { get; set; }
    }
}
