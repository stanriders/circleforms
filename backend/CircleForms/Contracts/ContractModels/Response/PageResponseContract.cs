using System.Collections.Generic;
using Newtonsoft.Json;

namespace CircleForms.Contracts.ContractModels.Response;

public class PageResponseContract
{
    [JsonProperty("authors")]
    public Dictionary<string, UserMinimalResponseContract> Authors { get; set; }

    [JsonProperty("posts")]
    public PostMinimalResponseContract[] Posts { get; set; }
}
