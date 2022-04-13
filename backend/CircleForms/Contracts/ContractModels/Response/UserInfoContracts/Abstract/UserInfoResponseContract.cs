namespace CircleForms.Contracts.ContractModels.Response.UserInfoContracts.Abstract;

public class UserInfoResponseContract<TUser, TPost>
{
    public TUser Users { get; set; }
    public TPost Posts { get; set; }
}
