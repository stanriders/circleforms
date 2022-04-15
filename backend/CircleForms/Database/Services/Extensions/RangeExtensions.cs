using CircleForms.Database.Models.Posts.Enums;

namespace CircleForms.Database.Services.Extensions;

public static class RangeExtensions
{
    public static bool IsInRange(this int value, MongoDbRange range)
    {
        return range.Start <= value && value <= range.End;
    }
}
