using System.Linq;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Database.Models.Posts.Questions;
using FluentValidation;

namespace CircleForms.Contracts.Validation;

public class SubmissionContractValidator : AbstractValidator<(Question Question, SubmissionContract Contract)>
{
    public SubmissionContractValidator()
    {
        When(x => x.Question.QuestionType == QuestionType.Freeform, () =>
        {
            RuleFor(x => x.Contract.Answers)
                .NotEmpty()
                .Must(x=> x.Length == 1)
                .WithMessage("There can't be more than one answer for a Freeform question");
        });

        When(x => x.Question.QuestionType == QuestionType.Checkbox, () =>
        {
            RuleFor(x => x.Contract.Answers)
                .NotNull()
                .Must((data, answers) =>
                    answers.All(x => !string.IsNullOrEmpty(x) && data.Question.QuestionInfo.Contains(x)))
                .WithMessage("Invalid answer array");
        });

        When(x => x.Question.QuestionType == QuestionType.Choice, () =>
        {
            RuleFor(x => x.Contract.Answers)
                .NotEmpty()
                .Must(x => x.Length == 1)
                .WithMessage("There can't be more than one answer for a Choice question")
                .Must((data, answers) => !string.IsNullOrEmpty(answers[0]) && data.Question.QuestionInfo.Contains(answers[0]))
                .WithMessage(x => $"{x.Contract.Answers[0]} is not a valid choice");
        });
    }
}
