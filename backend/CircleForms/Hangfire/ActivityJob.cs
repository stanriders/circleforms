using System;
using CircleForms.Database.Services.Abstract;
using CircleForms.ModelLayer.Jobs.Abstract;
using Hangfire;

namespace CircleForms.Hangfire;

public class ActivityJob : IActivityJob
{
    private readonly ICacheRepository _cache;
    private readonly IBackgroundJobClient _client;

    public ActivityJob(IBackgroundJobClient client, ICacheRepository cache)
    {
        _client = client;
        _cache = cache;
    }

    public void EnqueueSetInactive(string postId, DateTime trigger)
    {
        _client.Schedule(() => _cache.SetInactive(postId), trigger);
    }
}
