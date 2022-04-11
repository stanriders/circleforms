using AutoMapper;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Users;
using CircleForms.ModelLayer.DTO.Posts;
using CircleForms.ModelLayer.DTO.Users;

namespace CircleForms.ModelLayer.DTO.Mapping;

public class DtoMapper : Profile
{
    public DtoMapper()
    {
        CreateMap<User, UserDto>();
        CreateMap<UserMinimalRedis, UserMinimalDto>();
        CreateMap<Post, PostDto>();
    }
}
