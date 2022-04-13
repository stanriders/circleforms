using System.Linq;
using CircleForms.Contracts.ContractModels.Request;
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
                .Must(x => x?.Count >= 2).WithMessage("Question info must contain at least 2 elements")
                .Must(x => x?.All(v => !string.IsNullOrEmpty(v)) == true)
                .WithMessage("Question info can't contain empty values");
        });
    }
}

public class QuestionUpdateContractValidator : AbstractValidator<QuestionUpdateContract>
{
    public QuestionUpdateContractValidator()
    {
        When(x => x.Delete, () =>
        {
            RuleFor(x => x.Id)
                .NotEmpty();
        });

        When(x => x.QuestionType == QuestionType.Choice, () =>
        {
            RuleFor(x => x.QuestionInfo)
                .NotEmpty()
                .Must(x => x?.Count >= 2).WithMessage("Question info must contain at least 2 elements")
                .Must(x => x?.All(v => !string.IsNullOrEmpty(v)) == true)
                .WithMessage("Question info can't contain empty values");
        });
    }
}