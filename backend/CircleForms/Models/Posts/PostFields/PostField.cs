using CircleForms.Models.Enums;

namespace CircleForms.Models.Posts.PostFields;

public class PostField
{
    protected PostField() { }
    public virtual FieldType Type { get; set; }

    public string Value { get; set; }
}
