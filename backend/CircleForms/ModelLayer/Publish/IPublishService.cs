using System.Threading.Tasks;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Contracts.ContractModels.Response.Posts;

namespace CircleForms.ModelLayer.Publish;

public interface IPublishService
{
    public Task<Result<FullPostContract>> Publish(string id, string claim);
    public Task<Result<FullPostContract>> Unpublish(string id, string claim);
}
