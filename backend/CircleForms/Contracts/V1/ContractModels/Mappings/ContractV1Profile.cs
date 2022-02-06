using AutoMapper;
using CircleForms.Contracts.V1.ContractModels.Request;
using CircleForms.Contracts.V1.ContractModels.Response;
using CircleForms.Models;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions.Submissions;

namespace CircleForms.Contracts.V1.ContractModels.Mappings;

public class ContractV1Profile : Profile
{
    public ContractV1Profile()
    {
        CreateMap<User, UserResponseContract>();

        CreateMap<Post, PostResponseContract>();
        CreateMap<PostRedis, PostMinimalResponseContract>();
        CreateMap<Post, PostDetailedResponseContract>();

        CreateMap<SubmissionContract, Submission>();
        CreateMap<Post, PostRedis>()
            .ForMember(x => x.Id, x => x.MapFrom(v => v.ID.ToString()));
    }
}
