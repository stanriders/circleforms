using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Database.Models.Posts;
using FluentValidation;

namespace CircleForms.Contracts.Validation;

public class PostValidator : AbstractValidator<Post>
{
    public PostValidator()
    {
        RuleFor(x => x.Questions)
            .NotEmpty()
            .ForEach(x =>
            {
                x.SetValidator(new QuestionValidator());
            });
    }
}

public class PostUpdateRequestContractValidator : AbstractValidator<PostUpdateRequestContract>
{
    public PostUpdateRequestContractValidator()
    {
        RuleFor(x => x.Questions)
            .ForEach(x =>
            {
                x.SetValidator(new QuestionUpdateContractValidator());
            });
    }
}
