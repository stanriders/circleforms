using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Questions.Submissions;
using CircleForms.Database.Models.Users;
using CircleForms.Database.Services.Abstract;
using MongoDB.Driver;
using MongoDB.Entities;

namespace CircleForms.Database.Services;

public class AnswerRepository : IAnswerRepository
{
    public async Task<List<Answer>> Get()
    {
        return await DB.Fluent<Answer>().ToListAsync();
    }

    public async Task<Answer> Get(string answerId)
    {
        return await DB.Find<Answer>().OneAsync(answerId);
    }

    public async Task<List<Answer>> GetPostAnswers(string postId)
    {
        return await DB.Entity<Post>(postId).Answers.ChildrenFluent().ToListAsync();
    }

    public async Task<Answer> Add(string postId, List<Submission> submissions, string user)
    {
        var answer = new Answer
        {
            Submissions = submissions,
            UserRelation = user,
            PostRelation = postId
        };

        await answer.SaveAsync();
        await DB.Entity<User>(user).Answers.AddAsync(answer);
        await DB.Entity<Post>(postId).Answers.AddAsync(answer);

        return answer;
    }

    public async Task<Answer> Update(string postId, string oldAnswerId, List<Submission> submissions, string user)
    {
        var answer = new Answer
        {
            ID = oldAnswerId,
            Submissions = submissions,
            UserRelation = user,
            PostRelation = postId
        };

        await answer.SaveAsync();

        return answer;
    }
}
