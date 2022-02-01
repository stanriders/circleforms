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
