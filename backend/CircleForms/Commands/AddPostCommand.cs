using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Models.Posts;
using MediatR;

namespace CircleForms.Commands;

public class AddPostCommand : IRequest<CQRSResponse<Post>>
{
    public PostRequestContract Contract { get; }

    public string Claim { get; }
    public AddPostCommand(PostRequestContract contract, string claim)
    {
        Contract = contract;
        Claim = claim;
    }
}
