using System;

namespace CircleForms.Models;

public static class DateTimeExtensions
{
    public static long ToUnixTimestamp(this DateTime dateTime)
    {
        return ((DateTimeOffset) dateTime).ToUnixTimeMilliseconds();
    }
}
