using System.Collections.Generic;
using CircleForms.Contracts.Response.Users;

namespace CircleForms.Contracts.Response.Compound;

public class AnswersUsersContract
{
    public List<UserInAnswerContract> Users { get; set; }
    public List<AnswerContract> Answers { get; set; }
}
