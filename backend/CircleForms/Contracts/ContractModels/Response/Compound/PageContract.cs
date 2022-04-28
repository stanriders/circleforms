using System.Collections.Generic;
using CircleForms.Contracts.ContractModels.Response.Compound.Abstract;

namespace CircleForms.Contracts.ContractModels.Response.Compound;

public class PageContract :
    CompoundUserPost<List<UserMinimalContract>, MinimalPostContract[]>
{
}
