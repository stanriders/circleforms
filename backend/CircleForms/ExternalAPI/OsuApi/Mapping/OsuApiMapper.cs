using AutoMapper;
using CircleForms.Database.Models.Users;
using CircleForms.ExternalAPI.OsuApi.Configurations;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using AccountHistory = CircleForms.ExternalAPI.OsuApi.Contracts.AccountHistory;
using GradeCounts = CircleForms.ExternalAPI.OsuApi.Contracts.GradeCounts;
using Level = CircleForms.ExternalAPI.OsuApi.Contracts.Level;
using MonthlyPlaycount = CircleForms.ExternalAPI.OsuApi.Contracts.MonthlyPlaycount;
using RankHistory = CircleForms.ExternalAPI.OsuApi.Contracts.RankHistory;
using Statistics = CircleForms.ExternalAPI.OsuApi.Contracts.Statistics;
using UserAchievement = CircleForms.ExternalAPI.OsuApi.Contracts.UserAchievement;
using UserBadge = CircleForms.ExternalAPI.OsuApi.Contracts.UserBadge;

namespace CircleForms.ExternalAPI.OsuApi.Mapping;

public class OsuApiMapper : Profile
{
    public OsuApiMapper()
    {
        CreateMap<UserBadge, Database.Models.Users.UserBadge>();
        CreateMap<MonthlyPlaycount, Database.Models.Users.MonthlyPlaycount>();
        CreateMap<RankHistory, Database.Models.Users.RankHistory>();
        CreateMap<GradeCounts, Database.Models.Users.GradeCounts>();
        CreateMap<Level, Database.Models.Users.Level>();
        CreateMap<UserAchievement, Database.Models.Users.UserAchievement>();
        CreateMap<AccountHistory, Database.Models.Users.AccountHistory>();
        CreateMap<Statistics, Database.Models.Users.Statistics>();

        CreateMap<OsuUser, User>()
            .ForMember(x => x.ID,
                x => x.MapFrom(v => v.Id.ToString()));
        CreateMap<OsuApiConfig, RefreshTokenRequest>();
    }
}
