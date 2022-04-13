using System.Collections.Generic;
using CircleForms.Contracts.ContractModels.Response.UserInfoContracts.Abstract;

namespace CircleForms.Contracts.ContractModels.Response.UserInfoContracts;

public class
    PostDetailedUserAnswerResponseContract :
        UserInfoResponseContract<List<UserMinimalResponseContract>, PostDetailedResponseContract>
{
}
