using CircleForms.Models.Enums;

namespace CircleForms.Models.PostFields;

public class PostField
{
    protected PostField() { }
    public virtual FieldType Type { get; set; }

    public string Title { get; set; }
}
