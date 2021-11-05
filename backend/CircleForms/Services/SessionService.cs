using System;
using System.Collections.Generic;
using System.Linq;
using CircleForms.Models;
using CircleForms.Services.Interfaces;

namespace CircleForms.Services
{
    public class SessionService : ISessionService
    {
        private readonly HashSet<Session> _sessions;

        public SessionService(HashSet<Session> sessions)
        {
            _sessions = sessions;
        }

        public Session Get(Guid guid)
        {
            return _sessions.FirstOrDefault(x => x.Guid == guid);
        }

        public void Add(Session session)
        {
            _sessions.Add(session);
        }

        public void Remove(Predicate<Session> predicate)
        {
            _sessions.RemoveWhere(predicate);
        }
    }
}
