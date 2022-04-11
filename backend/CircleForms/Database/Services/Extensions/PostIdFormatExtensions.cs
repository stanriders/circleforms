namespace CircleForms.Database.Services.Extensions;

public static class PostIdFormatExtensions
{
    public static string ToPostId(this string id)
    {
        return $"post:{id}";
    }

    public static string ToPostAnswersCount(this string id)
    {
        return $"post:{id}:answers";
    }

    public static string ToUserId(this string user)
    {
        return $"user:{user}";
    }
}
