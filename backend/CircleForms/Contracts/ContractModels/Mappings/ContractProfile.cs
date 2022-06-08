using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Users;
using Mapster;

namespace CircleForms.Contracts.ContractModels.Mappings;

public class ContractProfile : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<User, UserMinimalRedis>()
            .Map(x => x.Username, x => x.Osu.Username)
            .Map(x => x.AvatarUrl, x => x.Osu.AvatarUrl);

        config.NewConfig<Answer, AnswerContract>()
            .Map(x => x.UserId, x => x.UserRelation.ID);
    }
}
