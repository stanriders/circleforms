using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models.Posts.Questions.Submissions;
using CircleForms.Models.Users;
using MongoDB.Entities;

namespace CircleForms.Models.Posts;

[Collection("answers")]
public class Answer : Entity
{
    [Field("answers")]
    public List<Submission> Submissions { get; set; }

    [Field("user")]
    public One<User> User { get; set; }
    
    [Field("post")]
    public One<Post> Post { get; set; }

    [Ignore]
    public User UserDto { get; set; }

    public async Task FetchUser()
    {
        UserDto = await User.ToEntityAsync(a => new User
        {
            ID = a.ID,
            AvatarUrl = a.AvatarUrl,
            CountryCode = a.CountryCode,
            Username = a.Username,
            Discord = a.Discord,
            JoinDate = a.JoinDate,
            Badges = a.Badges,
            Statistics = a.Statistics
        });
    }
}
