using System.Threading.Tasks;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.ModelLayer;
using MongoDB.Bson;

namespace CircleForms.Database.Services.Abstract;

public interface IGamemodeService
{
    Task<Result<BsonDocument>> GetStatistics(string userId, Gamemode mode);
}
