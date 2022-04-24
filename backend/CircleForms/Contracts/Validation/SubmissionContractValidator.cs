using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Questions;
using FluentValidation;

namespace CircleForms.Contracts.Validation;

public class SubmissionContractValidator : AbstractValidator<(Question Question, SubmissionContract Contract)>
{
    public SubmissionContractValidator()
    {
        When(x => x.Question.QuestionType == QuestionType.Freeform, () =>
        {
            RuleFor(x => x.Contract.Answer).NotEmpty();
        });

        When(x => x.Question.QuestionType == QuestionType.Checkbox, () =>
        {
            RuleFor(x => x.Contract.Answer)
                .Must(x => x is "true" or "false")
                .WithMessage("Answer is not a boolean with values 'true' or 'false'");
        });

        When(x => x.Question.QuestionType == QuestionType.Choice, () =>
        {
            RuleFor(x => x.Contract.Answer)
                .Must(x => int.TryParse(x, out var val) && val >= 0)
                .WithMessage("Answer is not a number greater than 0");

            RuleFor(x => x)
                .Must(x => x.Question.QuestionInfo.Contains(x.Contract.Answer))
                .WithMessage(x => $"Choice {x.Contract.Answer} is not in the list of valid choices");
        });
    }
}
