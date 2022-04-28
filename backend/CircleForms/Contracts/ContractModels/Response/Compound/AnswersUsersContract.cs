using System.Collections.Generic;

namespace CircleForms.Contracts.ContractModels.Response.Compound;

public class AnswersUsersResponseContract
{
    public List<UserAnswerContract> Users { get; set; }
    public List<AnswerContract> Answers { get; set; }
}
