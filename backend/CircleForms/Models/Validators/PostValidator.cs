using CircleForms.Contracts.V1.ContractModels.Request;
using CircleForms.Models.Posts;
using FluentValidation;

namespace CircleForms.Models.Validators;

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
