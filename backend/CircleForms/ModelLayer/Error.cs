﻿using System;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace CircleForms.ModelLayer;

public class Error : Result<object>
{
    public Error() : base(value: null)
    {
    }

    public Error(HttpStatusCode code, string message) : base(code, message)
    {
    }
}

public class Result<T>
{
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

    public T Value { get; }

    public HttpStatusCode StatusCode { get; }
    public string Message { get; }

    public bool IsError { get; }

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
        return new Error(StatusCode, Message);
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

        var payload = new {error = Message};

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
