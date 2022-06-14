using System.Collections.Generic;
using CircleForms.Contracts.Response.Posts;
using CircleForms.Contracts.Response.Users;

namespace CircleForms.Contracts.Response.Compound;

public class PageContract
{
    public List<UserMinimalContract> Users { get; set; }
    public MinimalPostContract[] Posts { get; set; }
}
