using System;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace CircleForms.Database.Models.Posts.Enums;

public class Limitations
{
    public MongoDbRange Rank { get; set; }
    public MongoDbRange Pp { get; set; }

    [BsonIgnore]
    [JsonIgnore]
    public Range? RankRange => Rank?.Start..Rank?.End;

    [BsonIgnore]
    [JsonIgnore]
    public Range? PpRange => Pp?.Start..Pp?.End;

    public Gamemode? Gamemode { get; set; }
}
