using System.Threading.Tasks;
using CircleForms.Domain;
using CircleForms.ExternalAPI.OsuApi.Contracts;

namespace CircleForms.ExternalAPI.OsuApi;

public interface IOsuApiProvider
{
    public Task<Result<OsuUser>> GetUser(string token);
    public Task<Result<TokenResponse>> RefreshToken(string refreshToken);
}
