using AutoMapper;

namespace CircleForms.Models.Posts.Questions.Answers;

public class AnswerContractToAnswerMapper : Profile
{
    private static string CalculateAnswer((QuestionType type, AnswerContract contract) value)
    {
        var (type, contract) = value;

        return type switch
        {
            QuestionType.Freeform when !string.IsNullOrWhiteSpace(contract.Answer) => contract.Answer,
            QuestionType.Checkbox when bool.TryParse(contract.Answer, out _) => contract.Answer,
            _ => null
        };
    }
    public AnswerContractToAnswerMapper()
    {
        CreateMap<(QuestionType type, AnswerContract contract), Answer>()
            .ForMember(x => x.Value,
                o => o.MapFrom(src => CalculateAnswer(src)));
    }
}
