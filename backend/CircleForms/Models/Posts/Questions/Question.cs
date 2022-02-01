using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;

namespace CircleForms.Models.Posts.Questions;

public class Question
{
    [JsonProperty("question_id")]
    [SwaggerSchema(ReadOnly = true)]
    public int Id { get; set; }

    [Required]
    [JsonProperty("type")]
    public QuestionType QuestionType { get; set; }

    [Required]
    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("is_optional")]
    public bool Optional { get; set; }

    [JsonProperty("question_info")]
    public List<string> QuestionInfo { get; set; }
}
