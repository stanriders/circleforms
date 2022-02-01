using AutoMapper;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions.Submissions;

namespace CircleForms.Models.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<SubmissionContract, Submission>();
        CreateMap<Post, PostRedis>()
            .ForMember(x => x.Id, x => x.MapFrom(v => v.Id.ToString()));
    }
}
