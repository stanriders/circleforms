using AutoMapper;
using CircleForms.Contracts.V1.ContactModels.Response;
using CircleForms.Models;
using CircleForms.Models.Posts;

namespace CircleForms.Contracts.V1.ContactModels.Mappings;

public class ContractV1Profile : Profile
{
    public ContractV1Profile()
    {
        CreateMap<User, ContractV1Profile>();

        CreateMap<Post, PostResponseContract>();
        CreateMap<PostRedis, PostMinimalResponseContract>();
    }
}
