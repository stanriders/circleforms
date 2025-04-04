using System;
using CircleForms.Database.Models.Posts;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;

namespace CircleForms.Database.Models.Users;

[Collection("users")]
public class User : IEntity
{
    public User()
    {
        // DB inits can't be done in unit testing due to how MongoDB.Entities database initialization works
        if (!UnitTestDetector.IsRunningFromXUnit)
        {
            this.InitOneToMany(() => PostsRelation);
            this.InitOneToMany(() => Answers);
        }
    }

    [Field("token")]
    public TokenResponse Token { get; set; }

    [Field("posts")]
    public Many<Post> PostsRelation { get; set; }

    [Field("answers")]
    public Many<Answer> Answers { get; set; }

    [Field("discord")]
    public string Discord { get; set; }

    [Field("role")]
    public Roles Roles { get; set; }

    [Field("osu")]
    public OsuUser Osu { get; set; }

    public string GenerateNewID()
    {
        return "000000";
    }

    [BsonId]
    public string ID { get; set; }
}

[Flags]
public enum Roles
{
    User = 0,
    Admin = 1,
    Moderator = 2,
    SuperAdmin = 4
}

public static class RoleConstants
{
    public const string SuperAdmin = "SuperAdmin";
    public const string Admin = "Admin";
    public const string Moderator = "Moderator";
    public const string User = "User";
}
