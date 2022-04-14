namespace CircleForms.Database.Models.Posts.Enums;

public class MongoDbRange
{
    public MongoDbRange(int start, int end)
    {
        Start = start;
        End = end;
    }

    public int Start { get; set; }
    public int End { get; set; }

    public bool IsInRange(int val)
    {
        return Start <= val && val <= End;
    }
}
