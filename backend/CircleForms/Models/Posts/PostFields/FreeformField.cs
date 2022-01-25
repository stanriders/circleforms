using CircleForms.Models.Enums;

namespace CircleForms.Models.Posts.PostFields;

public class FreeformField : PostField
{
    public override FieldType Type => FieldType.Freeform;

    public string Data { get; set; }
}
