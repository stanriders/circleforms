using Newtonsoft.Json;

namespace CircleForms.Models
{
    public class Post
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("author")]
        public User Author { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }
    }
}
