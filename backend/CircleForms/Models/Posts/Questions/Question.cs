using System.Collections.Generic;
using CircleForms.Models.Posts.Questions.Answers;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace CircleForms.Models.Posts.Questions;

public class Question
{
    [BsonId]
    [JsonProperty("question_id")]
    public int Id { get; set; }

    [JsonProperty("type")]
    public QuestionType QuestionType { get; set; }

    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("is_optional")]
    public bool Optional { get; set; }

    [JsonProperty("answers")]
    public List<Answer> Answers { get; set; }
}
