using System;

namespace CircleForms.Domain.Jobs.Abstract;

public interface IActivityJob
{
    void EnqueueSetInactive(string postId, DateTime trigger);
}
