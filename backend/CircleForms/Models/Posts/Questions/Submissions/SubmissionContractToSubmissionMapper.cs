using AutoMapper;

namespace CircleForms.Models.Posts.Questions.Submissions;

public class SubmissionContractToSubmissionMapper : Profile
{
    public SubmissionContractToSubmissionMapper()
    {
        CreateMap<(QuestionType type, SubmissionContract contract), Submission>()
            .ForMember(x => x.QuestionId, x => x.MapFrom(v => v.contract.QuestionId))
            .ForMember(x => x.Value,
                o => o.MapFrom(src => CalculateAnswer(src)));
    }

    private static string CalculateAnswer((QuestionType type, SubmissionContract contract) value)
    {
        var (type, contract) = value;

        return type switch
        {
            QuestionType.Freeform when !string.IsNullOrWhiteSpace(contract.Answer) => contract.Answer,
            QuestionType.Checkbox when bool.TryParse(contract.Answer, out _) => contract.Answer,
            _ => null
        };
    }
}
