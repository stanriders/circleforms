using System.Threading.Tasks;
using CircleForms.Contracts.ContractModels.Response;

namespace CircleForms.ModelLayer.Publish;

public interface IPublishService
{
    public Task<Result<PostResponseContract>> Publish(string id, string claim);
    public Task<Result<PostResponseContract>> Unpublish(string id, string claim);
}
