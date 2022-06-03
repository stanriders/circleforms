using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Questions.Submissions;

namespace CircleForms.Database.Services.Abstract;

public interface IAnswerRepository
{
    Task<Answer> Add(string postId, List<Submission> submissions, string user);
    Task<Answer> Update(string postId, string oldAnswerId, List<Submission> submissions, string user);
    Task<List<Answer>> Get();
    Task<Answer> Get(string answerId);
    Task<List<Answer>> GetPostAnswers(string postId);
}
