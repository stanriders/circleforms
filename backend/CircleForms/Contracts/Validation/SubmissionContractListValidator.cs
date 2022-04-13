using System.Collections.Generic;
using CircleForms.Contracts.ContractModels.Request;
using FluentValidation;

namespace CircleForms.Contracts.Validation;

public class SubmissionContractListValidator : AbstractValidator<List<SubmissionContract>>
{
    public SubmissionContractListValidator()
    {
        RuleForEach(x => x)
            .SetValidator(new SubmissionContractValidator());
    }
}
