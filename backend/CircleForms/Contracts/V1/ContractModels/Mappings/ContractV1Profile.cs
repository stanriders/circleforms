using AutoMapper;
using CircleForms.Contracts.V1.ContractModels.Response;
using CircleForms.Models;
using CircleForms.Models.Posts;

namespace CircleForms.Contracts.V1.ContractModels.Mappings;

public class ContractV1Profile : Profile
{
    public ContractV1Profile()
    {
        CreateMap<User, UserResponseContract>();

        CreateMap<Post, PostResponseContract>();
        CreateMap<PostRedis, PostMinimalResponseContract>();
    }
}
