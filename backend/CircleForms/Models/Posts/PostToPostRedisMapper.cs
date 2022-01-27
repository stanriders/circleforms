using AutoMapper;

namespace CircleForms.Models.Posts;

public class PostToPostRedisMapper : Profile
{
    public PostToPostRedisMapper()
    {
        CreateMap<Post, PostRedis>()
            .ForMember(x => x.Id, x => x.MapFrom(v => v.Id.ToString()));
    }
}
