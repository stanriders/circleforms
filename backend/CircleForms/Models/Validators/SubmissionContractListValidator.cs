using System.Collections.Generic;
using CircleForms.Models.Posts;
using FluentValidation;

namespace CircleForms.Models.Validators;

public class SubmissionContractListValidator : AbstractValidator<List<SubmissionContract>>
{
    public SubmissionContractListValidator()
    {
        RuleForEach(x => x)
            .SetValidator(new SubmissionContractValidator());
    }
}
