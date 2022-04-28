using System.Collections.Generic;
using CircleForms.Contracts.ContractModels.Response.Compound.Abstract;
using CircleForms.Contracts.ContractModels.Response.Posts;
using CircleForms.Contracts.ContractModels.Response.Users;

namespace CircleForms.Contracts.ContractModels.Response.Compound;

public class PageContract :
    CompoundUserPost<List<UserMinimalContract>, MinimalPostContract[]>
{
}
