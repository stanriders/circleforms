using System.Net;

namespace CircleForms.Models;

public class Result<T>
{
    public static Result<T> NotFound(string id) => new(HttpStatusCode.NotFound, $"Entity {id} is not found");
    public Result(T value)
    {
        Value = value;
        IsError = false;
    }

    public Result(HttpStatusCode code, string message)
    {
        StatusCode = code;
        Message = message;
        IsError = true;
    }

    public Result(string message)
    {
        StatusCode = HttpStatusCode.BadRequest;
        Message = message;
        IsError = true;
    }

    public static implicit operator Result<T>(T value)
    {
        return new Result<T>(value);
    }
    public T Value { get; }

    public HttpStatusCode StatusCode { get; }
    public string Message { get; }

    public bool IsError { get; }
}
