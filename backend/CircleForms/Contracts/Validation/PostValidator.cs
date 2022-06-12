using System;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Database.Models.Posts.Enums;
using FluentValidation;

namespace CircleForms.Contracts.Validation;

public class PostValidator : AbstractValidator<PostContractRequest>
{
    public PostValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty();

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
            RuleFor(x => x.Gamemode)
                .NotEmpty()
                .NotEqual(Gamemode.None);

            When(x => x.Limitations.Pp is not null, () =>
                RuleFor(x => x.Limitations.Pp)
                    .Must(x => x.Start > 0 && x.End > 0).WithMessage("PP should be bigger than 0")
                    .Must(x => x.End < x.Start).WithMessage("Start of the pp range should be bigger than end")
            );

            When(x => x.Limitations.Rank is not null, () =>
                RuleFor(x => x.Limitations.Rank)
                    .Must(x => x.Start > 0 && x.End > 0).WithMessage("Rank should be bigger than 0")
                    .Must(x => x.End > x.Start).WithMessage("End of the rank range should be bigger than start")
            );
        });
    }
}
