using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Models.OsuContracts;

namespace CircleForms.Services.Interfaces;

public interface IOsuApiProvider
{
    public Task<Result<OsuUser>> GetUser(string token);
    public Task<Result<TokenResponse>> RefreshToken(string refreshToken);
}
