using System.Threading.Tasks;
using CircleForms.Models.OAuth;

namespace CircleForms.Services.Interfaces
{
    public interface ITokenService
    {
        public Task<OAuthToken> NewCode(string code);
    }
}
