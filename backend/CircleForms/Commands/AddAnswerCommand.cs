using System.Collections.Generic;
using CircleForms.Contracts.ContractModels.Request;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CircleForms.Commands;

public class AddAnswerCommand : IRequest<CQRSResponse<object>>
{
    public string Id { get; }
    public string Claim { get; }
    public List<SubmissionContract> AnswerContracts { get; }

    public AddAnswerCommand(string id, string claim, List<SubmissionContract> answerContracts)
    {
        Id = id;
        Claim = claim;
        AnswerContracts = answerContracts;
    }
}
