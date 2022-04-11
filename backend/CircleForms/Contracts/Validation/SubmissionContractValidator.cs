using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Database.Models.Posts.Questions;
using FluentValidation;

namespace CircleForms.Contracts.Validation;

public class SubmissionContractValidator : AbstractValidator<SubmissionContract>
{
    public SubmissionContractValidator()
    {
        When(x => x.QuestionType == QuestionType.Freeform, () =>
        {
            RuleFor(x => x.Answer)
                .NotEmpty();
        });

        When(x => x.QuestionType == QuestionType.Checkbox, () =>
        {
            RuleFor(x => x.Answer)
                .Must(x => x is "true" or "false")
                .WithMessage("Answer is not a boolean with values 'true' or 'false'");
        });

        When(x => x.QuestionType == QuestionType.Choice, () =>
        {
            RuleFor(x => x.Answer)
                .Must(x => int.TryParse(x, out var val) && val >= 0)
                .WithMessage("Answer is not a number greater than 0");
        });
    }
}
