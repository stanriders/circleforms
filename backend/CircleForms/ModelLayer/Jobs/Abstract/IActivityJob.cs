using System;

namespace CircleForms.ModelLayer.Jobs.Abstract;

public interface IActivityJob
{
    void EnqueueSetInactive(string postId, DateTime trigger);
}
