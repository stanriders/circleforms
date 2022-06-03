using System;
using System.Collections.Generic;
using System.Linq;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Posts.Questions;
using CircleForms.Database.Models.Users;
using MongoDB.Entities;

namespace CircleForms.Database.Models.Posts;

[Collection("posts")]
public class Post : Entity
{
    public Post()
    {
        this.InitOneToMany(() => Answers);
    }

    [Field("author")]
    public One<User> AuthorRelation { get; set; }

    [Ignore]
    public string AuthorId => AuthorRelation.ID;

    [Field("answers")]
    public Many<Answer> Answers { get; set; }

    [Ignore]
    public int AnswerCount => Answers.Count();

    [Field("active_to")]
    public DateTime ActiveTo { get; set; }

    [Ignore]
    public bool IsActive => Published && DateTime.UtcNow < ActiveTo;

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

    [Field("gamemode")]
    public Gamemode Gamemode { get; set; }

    [Field("accessibility")]
    public Accessibility Accessibility { get; set; }

    [Field("limitations")]
    public Limitations Limitations { get; set; }

    [Field("published")]
    public bool Published { get; set; }

    [Field("allow_answer_edit")]
    public bool AllowAnswerEdit { get; set; }

    [Field("questions")]
    public List<Question> Questions { get; set; }

    [Field("publish_time")]
    public DateTime? PublishTime { get; set; }
}
