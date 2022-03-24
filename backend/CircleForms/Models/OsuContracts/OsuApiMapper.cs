using AutoMapper;
using CircleForms.Models.Configurations;
using MongoDB.Bson;

namespace CircleForms.Models.OsuContracts;

public class OsuApiMapper : Profile
{
    public OsuApiMapper()
    {
        CreateMap<UserBadge, Models.UserBadge>();
        CreateMap<MonthlyPlaycount, Models.MonthlyPlaycount>();
        CreateMap<RankHistory, Models.RankHistory>();
        CreateMap<GradeCounts, Models.GradeCounts>();
        CreateMap<Level, Models.Level>();
        CreateMap<UserAchievement, Models.UserAchievement>();
        CreateMap<AccountHistory, Models.AccountHistory>();
        CreateMap<Statistics, Models.Statistics>();

        CreateMap<OsuUser, User>()
            .ForMember(x => x.ID,
                x => x.MapFrom(v => v.Id.ToString()));
        CreateMap<OsuApiConfig, RefreshTokenRequest>();
    }
}
