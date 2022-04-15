using System;
using System.Net;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Services.Abstract;
using CircleForms.ExternalAPI.OsuApi;
using MongoDB.Bson;

namespace CircleForms.ModelLayer;

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

    public async Task<Result<BsonDocument>> GetStatistics(string userId, Gamemode mode)
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

        if (!user.Osu.Contains(_statisticsKey))
        {
            user.Osu.Add(new BsonElement(_statisticsKey, new BsonDocument()));
        }

        var statisticsList = user.Osu[_statisticsKey].AsBsonDocument;
        if (statisticsList.Contains(modeName))
        {
            return statisticsList[modeName].AsBsonDocument;
        }

        var osuUserResult = await _osuApiProvider.GetUser(user.Token.AccessToken, mode);
        if (osuUserResult.IsError)
        {
            return new Result<BsonDocument>(osuUserResult.StatusCode, osuUserResult.Message);
        }

        var statictics = osuUserResult.Value.Statistics.ToBsonDocument();
        statisticsList.Add(modeName, statictics);

        await _usersService.Update(userId, user);

        return statictics;
    }

    // TODO: statistics update
}
