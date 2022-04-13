using System.Collections.Generic;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class UserPostsResponseContract
{
    [JsonProperty("posts")]
    public List<PostMinimalResponseContract> Posts { get; set; }
}
