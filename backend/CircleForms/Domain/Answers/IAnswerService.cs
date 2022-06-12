using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Contracts.Request;
using CircleForms.Database.Models.Posts;

namespace CircleForms.Domain.Answers;

public interface IAnswerService
{
    public Task<Maybe<Error>> Answer(string user, string id, IEnumerable<SubmissionContract> answerContracts);
    Task<Result<List<Answer>>> GetAnswers(string claim, string id);
    Task<Maybe<Error>> DeleteAnswer(string claim, string postId);
}
