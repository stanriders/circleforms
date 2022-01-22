namespace CircleForms.Models;

public class MongoDbRange
{
    public MongoDbRange(int start, int end)
    {
        Start = start;
        End = end;
    }

    public int Start { get; set; }
    public int End { get; set; }
}
