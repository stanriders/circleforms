using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Enums;
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

        When(x => x.Limitations is not null, () =>
        {
            RuleFor(x => x.Gamemode).NotEqual(Gamemode.None);
        });
    }
}

public class PostUpdateRequestContractValidator : AbstractValidator<PostUpdateContract>
{
    public PostUpdateRequestContractValidator()
    {
        RuleFor(x => x.Questions)
            .ForEach(x =>
            {
                x.SetValidator(new QuestionUpdateContractValidator());
            });

        When(x => x.Limitations is not null, () =>
        {
            RuleFor(x => x.Gamemode).NotEqual(Gamemode.None);
        });
    }
}
