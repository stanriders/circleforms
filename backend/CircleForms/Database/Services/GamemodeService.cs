using System.Net;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Services.Abstract;
using CircleForms.ExternalAPI.OsuApi;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using CircleForms.ModelLayer;

namespace CircleForms.Database.Services;

public class GamemodeService : IGamemodeService
{
    private readonly IOsuApiProvider _osuApiProvider;
    private readonly IUserRepository _usersService;

    public GamemodeService(IUserRepository usersService, IOsuApiProvider osuApiProvider)
    {
        _usersService = usersService;
        _osuApiProvider = osuApiProvider;
    }

    public async Task<Result<Statistics>> GetStatistics(string userId, Gamemode mode)
    {
        if (mode is Gamemode.None)
        {
            return Result<Statistics>.Error("Tried fetching statistics for None gamemode!");
        }

        var user = await _usersService.Get(userId);
        if (user is null)
        {
            return Result<Statistics>.NotFound(userId);
        }

        var statistics = mode switch
        {
            Gamemode.Osu => user.Osu.Statistics.Osu,
            Gamemode.Taiko => user.Osu.Statistics.Taiko,
            Gamemode.Fruits => user.Osu.Statistics.Catch,
            Gamemode.Mania => user.Osu.Statistics.Mania,
            _ => null
        };

        return new Result<Statistics>(statistics);
    }

    public async Task<Result<StatisticsRulesets>> UpdateStatistics(string userId)
    {
        var user = await _usersService.Get(userId);
        if (user is null)
        {
            return Result<StatisticsRulesets>.NotFound(userId);
        }

        var osuUserResult = await _osuApiProvider.GetUser(user.Token.AccessToken);
        if (osuUserResult.IsError)
        {
            if (osuUserResult.Errors.StatusCode is HttpStatusCode.Unauthorized)
            {
                var newToken = await _osuApiProvider.RefreshToken(user.Token.RefreshToken);
                if (newToken.IsError)
                {
                    return Result<StatisticsRulesets>.Error(newToken.Errors);
                }

                user.Token = newToken.Value;
                osuUserResult = await _osuApiProvider.GetUser(user.Token.AccessToken);
            }
        }

        user.Osu = osuUserResult.Value;

        await _usersService.Update(user.ID, user);

        return new Result<StatisticsRulesets>(osuUserResult.Value.Statistics);
    }
}
