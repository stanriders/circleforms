using System.Net;

namespace CircleForms.Models;

public class Maybe<T>
{
    public static Maybe<T> NotFound(string id) => new(HttpStatusCode.NotFound, $"Entity {id} is not found");
    public Maybe(T value)
    {
        Value = value;
        IsError = false;
    }

    public Maybe(HttpStatusCode code, string message)
    {
        StatusCode = code;
        Message = message;
        IsError = true;
    }

    public Maybe(string message)
    {
        StatusCode = HttpStatusCode.BadRequest;
        Message = message;
        IsError = true;
    }

    public static implicit operator Maybe<T>(T value)
    {
        return new Maybe<T>(value);
    }
    public T Value { get; }

    public HttpStatusCode StatusCode { get; }
    public string Message { get; }

    public bool IsError { get; }
}
