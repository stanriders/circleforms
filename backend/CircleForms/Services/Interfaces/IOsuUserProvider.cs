using System.Threading.Tasks;
using CircleForms.Models;

namespace CircleForms.Services.Interfaces;

public interface IOsuUserProvider
{
    public Task<User> GetUser(string token);
}
