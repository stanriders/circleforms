using System;

namespace CircleForms;

/// <summary>
/// This exists ONLY for MongoDB.Entities-based models and MUST NOT be used anywhere else.
/// Doing workarounds for unit testing is a very very bad design, but unfortunately we can't avoid it here.
/// </summary>
public static class UnitTestDetector
{
    static UnitTestDetector()
    {
        foreach (var assem in AppDomain.CurrentDomain.GetAssemblies())
        {
            if (assem.FullName != null &&
                assem.FullName.ToLowerInvariant().StartsWith("xunit"))
            {
                IsRunningFromXUnit = true;
                break;
            }
        }
    }

    public static bool IsRunningFromXUnit { get; }
}
