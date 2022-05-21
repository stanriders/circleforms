using System;
using System.Net;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Users;
using CircleForms.Database.Services.Abstract;
using CircleForms.ExternalAPI.OsuApi;
using CircleForms.ModelLayer;
using MongoDB.Bson;

namespace CircleForms.Database.Services;

public class GamemodeService : IGamemodeService
{
    private readonly IUserRepository _usersService;
    private readonly IOsuApiProvider _osuApiProvider;

    private const string _statisticsKey = "Statistics";

    public GamemodeService(IUserRepository usersService, IOsuApiProvider osuApiProvider)
    {
        _usersService = usersService;
        _osuApiProvider = osuApiProvider;
    }

    public async Task<Result<BsonDocument>> GetOrAddStatistics(string userId, Gamemode mode)
    {
        if (mode is Gamemode.None)
        {
            return new Result<BsonDocument>(HttpStatusCode.BadRequest, "Tried fetching statistics for None gamemode!");
        }

        var user = await _usersService.Get(userId);
        if (user is null)
        {
            return Result<BsonDocument>.NotFound(userId);
        }

        var modeName = Enum.GetName(mode);

        if (user.Osu.Contains(_statisticsKey))
        {
            var statisticsList = user.Osu[_statisticsKey].AsBsonDocument;
            if (statisticsList.Contains(modeName))
            {
                return statisticsList[modeName].AsBsonDocument;
            }
        }

        return await UpdateStatisticsInternal(user, mode);
    }

    public async Task<Result<BsonDocument>> UpdateStatistics(string userId, Gamemode mode)
    {
        if (mode is Gamemode.None)
        {
            return new Result<BsonDocument>(HttpStatusCode.BadRequest, "Tried updating statistics for None gamemode!");
        }

        var user = await _usersService.Get(userId);
        if (user is null)
        {
            return Result<BsonDocument>.NotFound(userId);
        }

        return await UpdateStatisticsInternal(user, mode);
    }

    private async Task<Result<BsonDocument>> UpdateStatisticsInternal(User user, Gamemode mode)
    {
        var modeName = Enum.GetName(mode);

        if (!user.Osu.Contains(_statisticsKey))
        {
            user.Osu.Add(new BsonElement(_statisticsKey, new BsonDocument()));
        }

        var osuUserResult = await _osuApiProvider.GetUser(user.Token.AccessToken, mode);
        if (osuUserResult.IsError)
        {
            if (osuUserResult.StatusCode is HttpStatusCode.Unauthorized)
            {
                var newToken = await _osuApiProvider.RefreshToken(user.Token.RefreshToken);
                if (newToken.IsError)
                {
                    return new Result<BsonDocument>(newToken.StatusCode, newToken.Errors);
                }

                user.Token = newToken.Value;
                osuUserResult = await _osuApiProvider.GetUser(user.Token.AccessToken, mode);
            }
        }

        var statictics = osuUserResult.Value.Statistics.ToBsonDocument();

        var statisticsList = user.Osu[_statisticsKey].AsBsonDocument;
        if (statisticsList.Contains(modeName))
        {
            statisticsList[modeName] = statictics;
        }
        else
        {
            statisticsList.Add(modeName, statictics);
        }

        await _usersService.Update(user.ID, user);

        return statictics;
    }
}
