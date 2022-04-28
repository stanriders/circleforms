namespace CircleForms.Contracts.ContractModels.Response.Compound.Abstract;

public class CompoundUserPost<TUser, TPost>
{
    public TUser Users { get; set; }
    public TPost Posts { get; set; }
}
