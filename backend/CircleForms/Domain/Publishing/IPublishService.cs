using System.Threading.Tasks;
using CircleForms.Contracts.Response.Posts;

namespace CircleForms.Domain.Publishing;

public interface IPublishService
{
    public Task<Result<PostContract>> Publish(string id, string claim);
    public Task<Result<PostContract>> Unpublish(string id, string claim);
}
