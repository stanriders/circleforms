using System;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Database.Models.Posts.Enums;
using FluentValidation;

namespace CircleForms.Contracts.Validation;

public class PostValidator : AbstractValidator<PostContract>
{
    public PostValidator()
    {
        RuleFor(x => x.Questions)
            .NotEmpty()
            .ForEach(x =>
            {
                x.SetValidator(new QuestionValidator());
            });

        RuleFor(x => x.ActiveTo)
            .NotEmpty()
            .Must(x => x > DateTime.UtcNow)
            .WithMessage("ActiveTo can't be less than current time of the server")
            .Must(x => (x - DateTime.UtcNow).Days <= 365)
            .WithMessage("ActiveTo can't be more than a year");

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
