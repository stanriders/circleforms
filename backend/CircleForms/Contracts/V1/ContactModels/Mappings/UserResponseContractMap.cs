using AutoMapper;
using CircleForms.Models;

namespace CircleForms.Contracts.V1.ContactModels.Mappings;

public class UserResponseContractMap : Profile
{
    public UserResponseContractMap()
    {
        CreateMap<User, UserResponseContractMap>();
    }
}
