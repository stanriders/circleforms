using AutoMapper;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Questions;
using CircleForms.Database.Models.Posts.Questions.Submissions;
using CircleForms.Database.Models.Users;
using GradeCounts = CircleForms.Database.Models.Users.GradeCounts;
using Level = CircleForms.Database.Models.Users.Level;
using MonthlyPlaycount = CircleForms.Database.Models.Users.MonthlyPlaycount;
using RankHistory = CircleForms.Database.Models.Users.RankHistory;
using Statistics = CircleForms.Database.Models.Users.Statistics;
using UserBadge = CircleForms.Database.Models.Users.UserBadge;

namespace CircleForms.Contracts.ContractModels.Mappings;

public class ContractProfile : Profile
{
    public ContractProfile()
    {
        CreateMap<User, UserResponseContract>()
            .ForMember(x => x.Id, o => o.MapFrom(x => x.ID));
        CreateMap<UserMinimalRedis, UserMinimalResponseContract>();
        CreateMap<User, UserMinimalRedis>();
        CreateMap<User, UserAnswerContract>();

        CreateMap<UserBadge, Response.UserBadge>();
        CreateMap<MonthlyPlaycount, Response.MonthlyPlaycount>();
        CreateMap<RankHistory, Response.RankHistory>();
        CreateMap<GradeCounts, Response.GradeCounts>();
        CreateMap<Level, Response.Level>();
        CreateMap<Statistics, Response.Statistics>();

        CreateMap<Post, PostMinimalResponseContract>()
            .ForMember(x => x.AuthorId, x => x.MapFrom(v => v.AuthorRelation.ID))
            .ForMember(x => x.AnswerCount, x => x.MapFrom(v => v.Answers.Count));
        CreateMap<Post, PostResponseContract>()
            .ForMember(x => x.AuthorId, x => x.MapFrom(v => v.AuthorRelation.ID));
        CreateMap<PostRedis, PostMinimalResponseContract>();
        CreateMap<PostRedis, PostDetailedResponseContract>();
        CreateMap<Post, PostDetailedResponseContract>()
            .ForMember(x => x.AuthorId, x => x.MapFrom(v => v.AuthorRelation.ID));

        CreateMap<Answer, AnswerContract>();
        CreateMap<PostRequestContract, Post>();
        CreateMap<SubmissionContract, Submission>();
        CreateMap<Post, PostRedis>()
            .ForMember(x => x.AuthorId, x => x.MapFrom(v => v.AuthorRelation.ID))
            .ForMember(x => x.Id, x => x.MapFrom(v => v.ID.ToString()));

        CreateMap<PostUpdateRequestContract, Post>()
            .ForAllMembers(opts => opts.Condition((_, _, srcMember) => srcMember != null));

        CreateMap<QuestionUpdateContract, Question>()
            .ForAllMembers(opts => opts.Condition((_, _, srcMember) => srcMember != null));
    }
}
