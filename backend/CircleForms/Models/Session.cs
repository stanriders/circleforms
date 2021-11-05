using System;

namespace CircleForms.Models
{
    public record Session
    {
        public Session(long id)
        {
            Guid = Guid.NewGuid();
            Id = id;
        }

        public Guid Guid { get; }
        public long Id { get; }
    }
}
