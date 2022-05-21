﻿using CircleForms.Contracts.ContractModels.Request;
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
                .NotEmpty()
                .Must(x => x.Length >= 1)
                .ForEach(x => x.Must(y => y is "true" or "false").WithMessage("Answer is not a boolean with values 'true' or 'false'"));

            RuleFor(x => x)
                .Must(x => x.Contract.Answers.Length == x.Question.QuestionInfo.Count)
                .WithMessage(x => $"Answer count is not the same as question info count ({x.Contract.Answers.Length} vs {x.Question.QuestionInfo.Count})");
        });

        When(x => x.Question.QuestionType == QuestionType.Choice, () =>
        {
            RuleFor(x => x.Contract.Answers)
                .NotEmpty()
                .Must(x => x.Length == 1)
                .WithMessage("There can't be more than one answer for a Choice question")
                .Must(x => int.TryParse(x[0], out var val) && val >= 0)
                .WithMessage("Answer is not a number greater than 0");
        });
    }
}
