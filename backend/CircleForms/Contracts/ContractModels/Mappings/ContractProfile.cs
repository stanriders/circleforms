using CircleForms.Contracts.ContractModels.Request;
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
        config.NewConfig<User, UserContract>()
            .Map(x => x.Osu, x => BsonSerializer.Deserialize<object>(x.Osu, default));
        config.NewConfig<User, UserInAnswerContract>()
            .Map(x => x.Osu, x => BsonSerializer.Deserialize<OsuAnswerContract>(x.Osu, default));
        config.NewConfig<User, UserMinimalRedis>()
            .Map(x => x.Username, x => x.Osu["Username"])
            .Map(x => x.AvatarUrl, x => x.Osu["AvatarUrl"]);

        config.NewConfig<Answer, AnswerContract>()
            .Map(x => x.UserId, x => x.UserRelation.ID);

        config.NewConfig<PostUpdateContract, Post>()
            .IgnoreNullValues(true);
    }
}
