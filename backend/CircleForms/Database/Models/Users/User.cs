using System;
using CircleForms.Database.Models.Posts;
using CircleForms.ExternalAPI.OsuApi.Contracts;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;

namespace CircleForms.Database.Models.Users;

[Collection("users")]
public class User : IEntity
{
    public User()
    {
        this.InitOneToMany(() => PostsRelation);
    }

    [Field("token")]
    public TokenResponse Token { get; set; }

    [Field("posts")]
    public Many<Post> PostsRelation { get; set; }

    [Field("discord")]
    public string Discord { get; set; }

    [Field("role")]
    public Roles Roles { get; set; }

    [Field("osu")]
    public BsonDocument Osu { get; set; }

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
