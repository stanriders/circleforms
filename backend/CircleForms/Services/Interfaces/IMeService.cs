using System.Threading.Tasks;
using CircleForms.Models;
using CircleForms.Models.OAuth;

namespace CircleForms.Services.Interfaces
{
    public interface IMeService
    {
        public Task<User> GetUser(OAuthToken token);
    }
}
