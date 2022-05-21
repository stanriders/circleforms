﻿using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Contracts.ContractModels.Response.Compound;
using CircleForms.Contracts.ContractModels.Response.Posts;
using CircleForms.Contracts.ContractModels.Response.Users;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Users;
using CircleForms.ModelLayer;
using CircleForms.ModelLayer.Answers;
using CircleForms.ModelLayer.Publish;
using Mapster;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers;

[ApiController]
[Route("posts")]
public class PostsController : ControllerBase
{
    // test
    private static readonly string[] _imageUploadExtensions = {".jpg", ".png"};
    private readonly IAnswerService _answer;
    private readonly ILogger<PostsController> _logger;
    private readonly PostsService _posts;
    private readonly IPublishService _publish;

    public PostsController(ILogger<PostsController> logger, PostsService posts,
        IAnswerService answer,
        IPublishService publish)
    {
        _logger = logger;
        _posts = posts;
        _answer = answer;
        _publish = publish;
    }

    private string _claim => HttpContext.User.Identity!.Name;

    /// <summary>
    ///     Add answer to a question.
    /// </summary>
    [Authorize]
    [HttpPost(ApiEndpoints.PostsAnswer)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Answer(string id, [FromBody] List<SubmissionContract> answerContracts)
    {
        var postResult = await _answer.Answer(_claim, id, answerContracts);

        if (postResult.IsError && postResult.StatusCode is HttpStatusCode.Unauthorized)
        {
            _logger.LogWarning("User was not authorized to post answers to a post - probably outdated refresh token, logging them out...");

            await HttpContext.SignOutAsync("InternalCookies");
        }

        return postResult.Map();
    }

    /// <summary>
    ///     Upload an image.
    /// </summary>
    [Authorize]
    [HttpPut(ApiEndpoints.PostsUploadImage)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadImage(string id, IFormFile image, [FromQuery] ImageQuery query)
    {
        if (image is null)
        {
            return BadRequest("No multipart/form-data image was provided");
        }

        switch (image.Length)
        {
            case > 1 * 1024 * 1024: //1 mebibyte
                return BadRequest("File size is too big");
            case 0:
                return BadRequest("No file provided");
        }

        if (!_imageUploadExtensions.Contains(Path.GetExtension(image.FileName).ToLower()))
        {
            return BadRequest("This image extension in not allowed");
        }

        var result = await _posts.SaveImage(_claim, id, image, query);

        return result.Map();
    }

    /// <summary>
    ///     Add a new post.
    /// </summary>
    [Authorize]
    [HttpPost(ApiEndpoints.PostsAddPost)]
    [ProducesResponseType(typeof(MinimalPostContract), StatusCodes.Status201Created)]
    public async Task<IActionResult> Post(PostContract postContract)
    {
        var result = await _posts.AddPost(_claim, postContract);
        if (!result.IsError)
        {
            _logger.LogInformation("User {User} posts a post {PostId}", _claim, result.Value.ID);

            return CreatedAtAction("GetDetailed", new {id = result.Value.ID}, result.Value);
        }

        return result.Unwrap();
    }

    /// <summary>
    ///     Unpublish a post.
    /// </summary>
    [Authorize(Roles = $"{RoleConstants.Admin},{RoleConstants.Moderator}")]
    [HttpPost(ApiEndpoints.PostUnpublish)]
    [ProducesResponseType(typeof(FullPostContract), StatusCodes.Status200OK)]
    public async Task<IActionResult> Unpublish(string id)
    {
        var result = await _publish.Unpublish(id, _claim);

        return result.Unwrap();
    }

    /// <summary>
    ///     Publish a post.
    /// </summary>
    [Authorize]
    [HttpPost(ApiEndpoints.PostPublish)]
    [ProducesResponseType(typeof(FullPostContract), StatusCodes.Status200OK)]
    public async Task<IActionResult> Publish(string id)
    {
        var result = await _publish.Publish(id, _claim);

        return result.Unwrap();
    }

    /// <summary>
    ///     Update post.
    /// </summary>
    [Authorize]
    [HttpPatch(ApiEndpoints.PostsUpdatePost)]
    [ProducesResponseType(typeof(FullPostContract), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdatePost([FromBody] PostUpdateContract updateContract, string id)
    {
        var result = await _posts.UpdatePost(_claim, updateContract, id);

        return result.Unwrap();
    }

    /// <summary>
    ///     Get full info about a page if you are the creator of the page, otherwise return cached version.
    /// </summary>
    [HttpGet(ApiEndpoints.PostsDetailedPost)]
    [ProducesResponseType(typeof(FullPostContract), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(PostWithQuestionsContract), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetailed(string id, [FromQuery] string key = "")
    {
        var result = await _posts.GetDetailedPost(_claim, id, key);

        return result.Unwrap();
    }

    /// <summary>
    ///     Get posts' answers.
    /// </summary>
    [Authorize]
    [HttpGet(ApiEndpoints.PostsAnswer)]
    [ProducesResponseType(typeof(AnswersUsersContract), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAnswers(string id)
    {
        var result = await _answer.GetAnswers(_claim, id);
        if (result.IsError)
        {
            return result.Map();
        }

        var contract = new AnswersUsersContract
        {
            Answers = result.Value.Adapt<List<AnswerContract>>(),
            Users = (await Task.WhenAll(result.Value.Select(x => x.UserRelation.ToEntityAsync()))).Adapt<List<UserInAnswerContract>>()
        };

        return Ok(contract);
    }
}
