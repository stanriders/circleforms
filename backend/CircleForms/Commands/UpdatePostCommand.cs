using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Models.Posts;
using MediatR;

namespace CircleForms.Commands;

public class UpdatePostCommand : IRequest<CQRSResponse<Post>>
{
    public PostUpdateRequestContract Contract { get; }
    public string Id { get; }
    public string Claim { get; }

    public UpdatePostCommand(PostUpdateRequestContract contract, string id, string claim)
    {
        Contract = contract;
        Id = id;
        Claim = claim;
    }
}
