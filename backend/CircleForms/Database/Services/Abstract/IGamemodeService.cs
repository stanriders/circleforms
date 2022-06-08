using System.Threading.Tasks;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using CircleForms.ModelLayer;

namespace CircleForms.Database.Services.Abstract;

public interface IGamemodeService
{
    Task<Result<Statistics>> GetStatistics(string userId, Gamemode mode);
    Task<Result<StatisticsRulesets>> UpdateStatistics(string userId);
}
