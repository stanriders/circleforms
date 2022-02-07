using System.Threading.Tasks;
using CircleForms.Models.OsuContracts;

namespace CircleForms.Services.Interfaces;

public interface IOsuUserProvider
{
    public Task<OsuUser> GetUser(string token);
}
