using System.Collections.Generic;
using CircleForms.Contracts.ContractModels.Response.Compound.Abstract;

namespace CircleForms.Contracts.ContractModels.Response;

public class PageResponseContract :
    UserInfoResponseContract<List<UserMinimalResponseContract>, PostMinimalResponseContract[]>
{
}
