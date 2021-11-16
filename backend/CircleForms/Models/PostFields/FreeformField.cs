using CircleForms.Models.Enums;

namespace CircleForms.Models.PostFields
{
    public class FreeformField : PostField
    {
        public override FieldType Type => FieldType.Freeform;

        public string Data { get; set; }
    }
}
