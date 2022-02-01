using System.Linq;
using CircleForms.Models.Posts.Questions;
using FluentValidation;

namespace CircleForms.Models.Validators;

public class QuestionValidator : AbstractValidator<Question>
{
    public QuestionValidator()
    {
        When(x => x.QuestionType == QuestionType.Choice, () =>
        {
            RuleFor(x => x.QuestionInfo)
                .NotEmpty()
                .Must(x => x.Count >= 2).WithMessage("Question info must contain at least 2 elements")
                .Must(x => x.All(v => !string.IsNullOrEmpty(v))).WithMessage("Question info can't contain empty values");
        });
    }
}
