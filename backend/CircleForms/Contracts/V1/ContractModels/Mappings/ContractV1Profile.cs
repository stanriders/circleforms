using AutoMapper;
using CircleForms.Contracts.V1.ContractModels.Request;
using CircleForms.Contracts.V1.ContractModels.Response;
using CircleForms.Models;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using CircleForms.Models.Posts.Questions.Submissions;
using GradeCounts = CircleForms.Models.GradeCounts;
using Level = CircleForms.Models.Level;
using MonthlyPlaycount = CircleForms.Models.MonthlyPlaycount;
using RankHistory = CircleForms.Models.RankHistory;
using Statistics = CircleForms.Models.Statistics;
using UserBadge = CircleForms.Models.UserBadge;

namespace CircleForms.Contracts.V1.ContractModels.Mappings;

public class ContractV1Profile : Profile
{
    public ContractV1Profile()
    {
        CreateMap<User, UserResponseContract>()
            .ForMember(x => x.Id, o => o.MapFrom(x => x.ID));
        CreateMap<UserBadge, Response.UserBadge>();
        CreateMap<MonthlyPlaycount, Response.MonthlyPlaycount>();
        CreateMap<RankHistory, Response.RankHistory>();
        CreateMap<GradeCounts, Response.GradeCounts>();
        CreateMap<Level, Response.Level>();
        CreateMap<Statistics, Response.Statistics>();

        CreateMap<Post, PostMinimalResponseContract>();
        CreateMap<Post, PostResponseContract>();
        CreateMap<PostRedis, PostMinimalResponseContract>();
        CreateMap<Post, PostDetailedResponseContract>();

        CreateMap<PostRequestContract, Post>();
        CreateMap<SubmissionContract, Submission>();
        CreateMap<Post, PostRedis>()
            .ForMember(x => x.Id, x => x.MapFrom(v => v.ID.ToString()));

        CreateMap<PostUpdateRequestContract, Post>()
            .ForAllMembers(opts => opts.Condition((_, _, srcMember) => srcMember != null));

        CreateMap<QuestionUpdateContract, Question>()
            .ForAllMembers(opts => opts.Condition((_, _, srcMember) => srcMember != null));
    }
}
