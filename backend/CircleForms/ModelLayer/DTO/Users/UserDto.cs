using System;
using System.Collections.Generic;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Users;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using AccountHistory = CircleForms.Database.Models.Users.AccountHistory;
using MonthlyPlaycount = CircleForms.Database.Models.Users.MonthlyPlaycount;
using RankHistory = CircleForms.Database.Models.Users.RankHistory;
using Statistics = CircleForms.Database.Models.Users.Statistics;
using UserBadge = CircleForms.Database.Models.Users.UserBadge;

namespace CircleForms.ModelLayer.DTO.Users;

public class UserDto
{
    public TokenResponse Token { get; set; }

    public List<Post> Posts { get; set; }

    public List<Answer> Answers { get; set; }

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

    public string ID { get; set; }
}
