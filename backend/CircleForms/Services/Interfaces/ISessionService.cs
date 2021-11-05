using System;
using CircleForms.Models;

namespace CircleForms.Services.Interfaces
{
    public interface ISessionService
    {
        Session Get(Guid guid);
        void Add(Session session);
        void Remove(Predicate<Session> predicate);
    }
}
