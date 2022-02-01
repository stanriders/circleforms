using AutoMapper;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using CircleForms.Models.Posts.Questions.Submissions;

namespace CircleForms.Models.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<(QuestionType type, SubmissionContract contract), Submission>()
            .ForMember(x => x.QuestionId, x => x.MapFrom(v => v.contract.QuestionId))
            .ForMember(x => x.Value,
                o => o.MapFrom(src => CalculateAnswer(src)));

        CreateMap<Post, PostRedis>()
            .ForMember(x => x.Id, x => x.MapFrom(v => v.ID.ToString()));
    }

    private static string CalculateAnswer((QuestionType type, SubmissionContract contract) value)
    {
        var (type, contract) = value;

        return type switch
        {
            QuestionType.Freeform when !string.IsNullOrWhiteSpace(contract.Answer) => contract.Answer,
            QuestionType.Checkbox when bool.TryParse(contract.Answer, out _) => contract.Answer,
            QuestionType.Choice when int.TryParse(contract.Answer, out _) => contract.Answer,
            _ => null
        };
    }
}
