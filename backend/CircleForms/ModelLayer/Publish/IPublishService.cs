using System.Threading.Tasks;
using CircleForms.Contracts.ContractModels.Response.Posts;

namespace CircleForms.ModelLayer.Publish;

public interface IPublishService
{
    public Task<Result<PostContract>> Publish(string id, string claim);
    public Task<Result<PostContract>> Unpublish(string id, string claim);
}
