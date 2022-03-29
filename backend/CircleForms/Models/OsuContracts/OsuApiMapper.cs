using AutoMapper;
using CircleForms.Models.Configurations;
using CircleForms.Models.Users;
using MongoDB.Bson;

namespace CircleForms.Models.OsuContracts;

public class OsuApiMapper : Profile
{
    public OsuApiMapper()
    {
        CreateMap<UserBadge, Users.UserBadge>();
        CreateMap<MonthlyPlaycount, Users.MonthlyPlaycount>();
        CreateMap<RankHistory, Users.RankHistory>();
        CreateMap<GradeCounts, Users.GradeCounts>();
        CreateMap<Level, Users.Level>();
        CreateMap<UserAchievement, Users.UserAchievement>();
        CreateMap<AccountHistory, Users.AccountHistory>();
        CreateMap<Statistics, Users.Statistics>();

        CreateMap<OsuUser, User>()
            .ForMember(x => x.ID,
                x => x.MapFrom(v => v.Id.ToString()));
        CreateMap<OsuApiConfig, RefreshTokenRequest>();
    }
}
