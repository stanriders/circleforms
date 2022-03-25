using AutoMapper;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Models;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using CircleForms.Models.Posts.Questions.Submissions;
using CircleForms.Models.Users;
using GradeCounts = CircleForms.Models.Users.GradeCounts;
using Level = CircleForms.Models.Users.Level;
using MonthlyPlaycount = CircleForms.Models.Users.MonthlyPlaycount;
using RankHistory = CircleForms.Models.Users.RankHistory;
using Statistics = CircleForms.Models.Users.Statistics;
using UserBadge = CircleForms.Models.Users.UserBadge;

namespace CircleForms.Contracts.ContractModels.Mappings;

public class ContractProfile : Profile
{
    public ContractProfile()
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
        CreateMap<PostRedis, PostDetailedResponseContract>();
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
