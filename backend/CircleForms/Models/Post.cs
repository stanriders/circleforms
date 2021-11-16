using System.Collections.Generic;
using CircleForms.Models.Enums;
using CircleForms.Models.PostFields;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace CircleForms.Models
{
    public class Post
    {
        [BsonId]
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("creator_id")]
        public long CreatorId { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("accessibility")]
        public Accessibility Accessibility { get; set; }

        [JsonProperty("limitations")]
        public Limitations Limitations { get; set; }

        [JsonProperty("published")]
        public bool Published { get; set; }

        [JsonProperty("fields")]
        public List<PostField> Fields { get; set; }
    }
}
