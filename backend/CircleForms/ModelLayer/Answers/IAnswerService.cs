using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Contracts.ContractModels.Request;

namespace CircleForms.ModelLayer.Answers;

public interface IAnswerService
{
    public Task<Error> Answer(string user, string id, IEnumerable<SubmissionContract> answerContracts);
}
