using System;
using System.Collections.Generic;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Posts.Questions;
using CircleForms.Database.Models.Users;

namespace CircleForms.ModelLayer.DTO.Posts;

public class PostDto
{
    public User Author { get; set; }

    public List<Answer> Answers { get; set; }

    public bool IsActive { get; set; }

    public string Title { get; set; }

    public string Icon { get; set; }

    public string Banner { get; set; }

    public string AccessKey { get; set; }

    public string Description { get; set; }

    public string Excerpt { get; set; }

    public Accessibility Accessibility { get; set; }

    public Limitations Limitations { get; set; }

    public bool Published { get; set; }

    public List<Question> Questions { get; set; }

    public DateTime PublishTime { get; set; }
}
