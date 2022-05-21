using System;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace CircleForms.ModelLayer;

public class Error : Result<object>
{
    public Error() : base(value: null)
    {
    }

    public Error(HttpStatusCode code) : base(code, "")
    {
    }

    public Error(HttpStatusCode code, string message) : base(code, message)
    {
    }

    public Error(HttpStatusCode code, ErrorData[] errors) : base(code, errors)
    {
    }
}

public class ErrorData
{
    public string Source { get; set; }
    public string Message { get; set; }
}

public class Result<T>
{
    public Result(T value)
    {
        Value = value;
    }

    public Result(HttpStatusCode code, string message)
    {
        StatusCode = code;
        Errors = new ErrorData[] { new() {Message = message} };
    }

    public Result(string message)
    {
        StatusCode = HttpStatusCode.BadRequest;
        Errors = new ErrorData[] { new() { Message = message } };
    }

    public Result(HttpStatusCode code, ErrorData[] errors)
    {
        StatusCode = code;
        Errors = errors;
    }

    public Result(ErrorData[] errors)
    {
        StatusCode = HttpStatusCode.BadRequest;
        Errors = errors;
    }

    public T Value { get; }

    public HttpStatusCode StatusCode { get; }
    public ErrorData[] Errors { get; }

    public bool IsError => Errors?.Length > 0;

    public string Message => string.Join(", ", Errors.Select(x => $"{x.Source} - {x.Message}"));

    public static Result<T> NotFound(string id)
    {
        return new Result<T>(HttpStatusCode.NotFound, $"Entity {id} is not found");
    }

    public static Result<T> Forbidden()
    {
        return new Result<T>(HttpStatusCode.Forbidden, "You're not allowed to access that resource");
    }

    public Error ToError()
    {
        return new Error(StatusCode, Errors);
    }

    public IActionResult Map()
    {
        return !IsError ? new OkResult() : Map(_ => _);
    }

    public IActionResult Unwrap()
    {
        return Map(_ => _);
    }

    public IActionResult Map<TR>(Func<T, TR> mapOk)
    {
        if (!IsError)
        {
            return new OkObjectResult(mapOk(Value));
        }

        var payload = new {errors = Errors};

        return StatusCode switch
        {
            HttpStatusCode.BadRequest => new BadRequestObjectResult(payload),
            HttpStatusCode.Conflict => new ConflictObjectResult(payload),
            HttpStatusCode.NotFound => new NotFoundObjectResult(payload),
            HttpStatusCode.Forbidden => new ForbidResult(),
            HttpStatusCode.Unauthorized => new UnauthorizedObjectResult(payload),
            _ => new ObjectResult(payload) {StatusCode = (int) StatusCode}
        };
    }

    public static implicit operator Result<T>(T value)
    {
        return new Result<T>(value);
    }
}
