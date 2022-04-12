using System.Collections.Generic;
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
            .Map(x => x.Osu, x => BsonSerializer.Deserialize<object>(x.Osu, null))
            .Map(x => x.ID, x => x.ID);
        config.NewConfig<User, UserAnswerContract>()
            .Map(x => x.Osu, x => BsonSerializer.Deserialize<OsuUserStatisticsContract>(x.Osu, null));
        config.ForType<Post, PostResponseContract>()
            .AfterMappingAsync(async (poco, dto) =>
            {
                dto.Author = (await poco.Author).Adapt<UserAnswerContract>();
                dto.Answers = await poco.Answers.BuildAdapter()
                    .AdaptToAsync(new List<AnswerContract>());
            });
        config.ForType<Answer, AnswerContract>()
            .AfterMappingAsync(async (poco, dto) =>
            {
                dto.User = (await poco.User).Adapt<UserAnswerContract>();
            });
    }
}
