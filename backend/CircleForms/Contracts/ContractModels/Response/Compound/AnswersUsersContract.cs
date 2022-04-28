using System.Collections.Generic;

namespace CircleForms.Contracts.ContractModels.Response.Compound;

public class AnswersUsersContract
{
    public List<UserInAnswerContract> Users { get; set; }
    public List<AnswerContract> Answers { get; set; }
}
