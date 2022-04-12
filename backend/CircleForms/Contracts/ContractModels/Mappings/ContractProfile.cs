﻿using System.Collections.Generic;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Database.Models.Users;
using Mapster;

namespace CircleForms.Contracts.ContractModels.Mappings;

public class ContractProfile : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<User, UserResponseContract>()
            .Map(x => x.Osu, x => x.Osu.ToDictionary())
            .Map(x => x.Id, x => x.ID);
        config.NewConfig<User, UserAnswerContract>()
            .Map(x => x.Osu, x => new Dictionary<string, object>
            {
                {"statistics", x.Osu["Statistics"]},
                {"country_code", x.Osu["CountryCode"]}
            });
    }
}
