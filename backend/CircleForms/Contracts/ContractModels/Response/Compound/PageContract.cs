using System.Collections.Generic;
using CircleForms.Contracts.ContractModels.Response.Posts;
using CircleForms.Contracts.ContractModels.Response.Users;

namespace CircleForms.Contracts.ContractModels.Response.Compound;

public class PageContract
{
    public List<UserMinimalContract> Users { get; set; }
    public MinimalPostContract[] Posts { get; set; }
}
