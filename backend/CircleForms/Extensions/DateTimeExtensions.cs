using System;

namespace CircleForms.Extensions;

public static class DateTimeExtensions
{
    public static long ToUnixTimestamp(this DateTime dateTime)
    {
        return ((DateTimeOffset) dateTime).ToUnixTimeMilliseconds();
    }
}
