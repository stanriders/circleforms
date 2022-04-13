using System;
using System.Collections.Generic;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Posts.Questions;
using CircleForms.Database.Models.Users;
using MongoDB.Entities;

namespace CircleForms.Database.Models.Posts;

[Collection("posts")]
public class Post : Entity
{
    [Field("author")]
    public One<User> AuthorRelation { get; set; }

    [Ignore]
    public string AuthorId => AuthorRelation.ID;

    [Field("answers")]
    public List<Answer> Answers { get; set; } = new();

    [Field("is_active")]
    public bool IsActive { get; set; }

    [Field("title")]
    public string Title { get; set; }

    [Field("icon")]
    public string Icon { get; set; }

    [Field("banner")]
    public string Banner { get; set; }

    [Field("access_key")]
    public string AccessKey { get; set; }

    [Field("description")]
    public string Description { get; set; }

    [Field("excerpt")]
    public string Excerpt { get; set; }

    [Field("accessibility")]
    public Accessibility Accessibility { get; set; }

    [Field("limitations")]
    public Limitations Limitations { get; set; }

    [Field("published")]
    public bool Published { get; set; }

    [Field("questions")]
    public List<Question> Questions { get; set; }

    [Field("publish_time")]
    public DateTime PublishTime { get; set; }
}
