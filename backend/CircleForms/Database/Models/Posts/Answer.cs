using System.Collections.Generic;
using CircleForms.Database.Models.Posts.Questions.Submissions;
using CircleForms.Database.Models.Users;
using MongoDB.Entities;

namespace CircleForms.Database.Models.Posts;

public class Answer
{
    [Field("answers")]
    public List<Submission> Submissions { get; set; }

    [Field("user")]
    public One<User> UserRelation { get; set; }
}
