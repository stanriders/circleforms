using CircleForms.Database.Models.Users;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using Mapster;

namespace CircleForms.ExternalAPI.OsuApi.Mapping;

public class OsuApiMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<OsuUser, User>()
            .Map(x => x.ID, x => x.Id.ToString());
    }
}
