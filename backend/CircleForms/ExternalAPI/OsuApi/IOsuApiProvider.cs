using System.Threading.Tasks;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using CircleForms.ModelLayer;

namespace CircleForms.ExternalAPI.OsuApi;

public interface IOsuApiProvider
{
    public Task<Result<OsuUser>> GetUser(string token);
    public Task<Result<TokenResponse>> RefreshToken(string refreshToken);
}
