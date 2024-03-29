﻿using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CircleForms.Domain;

public readonly struct ErrorData
{
    public string Source { get; init; }
    public string Message { get; init; }
}

public readonly struct Error
{
    public Error(string message, HttpStatusCode status) : this(new[] { new ErrorData { Message = message } }, status)
    {
    }

    public Error(ErrorData[] errors, HttpStatusCode status)
    {
        Errors = errors;
        StatusCode = status;
    }

    public static Error NotFound(string id)
    {
        return new Error($"Entity {id} is not found", HttpStatusCode.NotFound);
    }

    public static Error Forbidden()
    {
        return new Error("You're not allowed to access that resource", HttpStatusCode.Forbidden);
    }

    public ErrorData[] Errors { get; }
    public HttpStatusCode StatusCode { get; }

    public IActionResult ToActionResult()
    {
        var payload = new { errors = Errors };

        return StatusCode switch
        {
            HttpStatusCode.BadRequest => new BadRequestObjectResult(payload),
            HttpStatusCode.Conflict => new ConflictObjectResult(payload),
            HttpStatusCode.NotFound => new NotFoundObjectResult(payload),
            HttpStatusCode.Forbidden => new ForbidResult(),
            HttpStatusCode.Unauthorized => new UnauthorizedObjectResult(payload),
            _ => new ObjectResult(payload) { StatusCode = (int) StatusCode }
        };
    }
}

public readonly struct Maybe<T>
{
    public T Value { get; private init; }
    public bool IsSome { get; init; }
    public bool IsNone => !IsSome;

    /// <summary>
    ///     Factory constructor <see cref="Maybe{T}.Some(T)" /> is better
    /// </summary>
    public Maybe(T value)
    {
        Value = value;
        IsSome = true;
    }

    public static Maybe<T> Some(T value)
    {
        return new Maybe<T>
        {
            Value = value,
            IsSome = true
        };
    }

    public TR Map<TR>(Func<T, TR> some, Func<TR> none)
    {
        return IsSome ? some(Value) : none();
    }

    public async Task<TR> MapAsync<TR>(Func<T, Task<TR>> some, Func<TR> none)
    {
        return IsSome ? await some(Value) : none();
    }

    public static Maybe<T> None()
    {
        return new Maybe<T>
        {
            Value = default,
            IsSome = false
        };
    }
}

public readonly struct Result<T>
{
    public Result(T value)
    {
        Value = value;
        Errors = default;
        IsError = false;
    }

    private Result(Error errors)
    {
        Errors = errors;
        IsError = true;
        Value = default;
    }

    public bool IsError { get; }
    public T Value { get; }
    public Error Errors { get; }

    public static Result<T> Error(string message, HttpStatusCode status = HttpStatusCode.BadRequest)
    {
        return new Result<T>(new Error(message, status));
    }

    public static Result<T> Error(Error error)
    {
        return new Result<T>(error);
    }

    public static Result<T> Error(ErrorData[] errorData, HttpStatusCode status = HttpStatusCode.BadRequest)
    {
        return new Result<T>(new Error(errorData, status));
    }

    public static Result<T> NotFound(string id)
    {
        return new Result<T>(Domain.Error.NotFound(id));
    }

    public static Result<T> Forbidden()
    {
        return new Result<T>(Domain.Error.Forbidden());
    }

    public async Task<TR> MapAsync<TR>(Func<T, Task<TR>> ok, Func<Error, TR> error)
    {
        if (IsError)
        {
            return error(Errors);
        }

        return await ok(Value);
    }

    public TR Map<TR>(Func<T, TR> ok, Func<Error, TR> error)
    {
        if (IsError)
        {
            return error(Errors);
        }

        return ok(Value);
    }

    public IActionResult ToActionResult()
    {
        return Map(x => new OkObjectResult(x), error => error.ToActionResult());
    }
}
