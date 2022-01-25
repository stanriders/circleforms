using CircleForms.Models.Enums;

namespace CircleForms.Models.Posts.PostFields;

public class ChoiceField : PostField
{
    public override FieldType Type => FieldType.Choice;

    public string[] Options { get; set; }

    public int? Choice { get; set; }
}
