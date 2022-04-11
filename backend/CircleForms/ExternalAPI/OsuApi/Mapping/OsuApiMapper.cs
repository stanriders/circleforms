using AutoMapper;
using CircleForms.Database.Models.Users;
using CircleForms.ExternalAPI.OsuApi.Configurations;
using CircleForms.ExternalAPI.OsuApi.Contracts;

namespace CircleForms.ExternalAPI.OsuApi.Mapping;

public class OsuApiMapper : Profile
{
    public OsuApiMapper()
    {
        CreateMap<OsuUser, User>()
            .ForMember(x => x.ID,
                x => x.MapFrom(v => v.Id.ToString()));
        CreateMap<OsuApiConfig, RefreshTokenRequest>();
    }
}
