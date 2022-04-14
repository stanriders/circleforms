using System.Threading.Tasks;
using CircleForms.Database.Models.Posts.Enums;
using MongoDB.Bson;

namespace CircleForms.ModelLayer;

public interface IGamemodeService
{
    Task<Result<BsonDocument>> GetStatistics(string userId, Gamemode mode);
}
