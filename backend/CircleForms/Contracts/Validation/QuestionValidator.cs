using System.Linq;
using CircleForms.Database.Models.Posts.Questions;
using FluentValidation;

namespace CircleForms.Contracts.Validation;

public class QuestionValidator : AbstractValidator<Question>
{
    public QuestionValidator()
    {
        When(x => x.QuestionType == QuestionType.Choice, () =>
        {
            RuleFor(x => x.QuestionInfo)
                .NotEmpty()
                .Must(x => x.Count >= 2)
                .WithMessage("Question info must contain at least 2 elements")
                .Must(x => x.All(v => !string.IsNullOrEmpty(v)))
                .WithMessage("Question info can't contain empty values");
        });

        When(x => x.QuestionType == QuestionType.Checkbox, () =>
        {
            RuleFor(x => x.QuestionInfo)
                .NotEmpty()
                .Must(x => x.Count >= 1)
                .WithMessage("Question info must contain at least 1 element")
                .Must(x => x.All(v => !string.IsNullOrEmpty(v)))
                .WithMessage("Question info can't contain empty values");
        });
    }
}
