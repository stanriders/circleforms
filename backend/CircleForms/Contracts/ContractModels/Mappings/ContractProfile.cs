using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Users;
using Mapster;
using MongoDB.Bson.Serialization;

namespace CircleForms.Contracts.ContractModels.Mappings;

public class ContractProfile : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<User, UserResponseContract>()
            .Map(x => x.Osu, x => BsonSerializer.Deserialize<object>(x.Osu, default));
        config.NewConfig<User, UserAnswerContract>()
            .Map(x => x.Osu, x => BsonSerializer.Deserialize<OsuAnswerContract>(x.Osu, default));
        config.NewConfig<Answer, AnswerContract>()
            .Map(x => x.UserId, x => x.UserRelation.ID);
    }
}
