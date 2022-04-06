﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Models;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts;
using CircleForms.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers;

[ApiController]
[Route("[controller]")]
public class PostsController : ControllerBase
{
    private static readonly string[] _imageUploadExtensions = {".jpg", ".png"};
    private readonly ILogger<PostsController> _logger;
    private readonly IMapper _mapper;
    private readonly PostsService _posts;

    public PostsController(ILogger<PostsController> logger, PostsService posts, IMapper mapper)
    {
        _logger = logger;
        _posts = posts;
        _mapper = mapper;
    }

    private string _claim => HttpContext.User.Identity!.Name;

    private IActionResult Map<T, TR>(Result<T> result)
    {
        return result.Map(arg => _mapper.Map<TR>(arg));
    }

    /// <summary>
    ///     Add answer to a question. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpPost(ApiEndpoints.PostsAnswer)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Answer(string id, [FromBody] List<SubmissionContract> answerContracts)
    {
        var postResult = await _posts.Answer(_claim, id, answerContracts);

        return postResult.Map();
    }

    /// <summary>
    ///     Upload an image. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpPut(ApiEndpoints.PostsUploadImage)]
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
    ///     Add a new post. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpPost(ApiEndpoints.PostsAddPost)]
    [ProducesResponseType(typeof(PostMinimalResponseContract), StatusCodes.Status201Created, "application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Post(PostRequestContract postContract)
    {
        var post = _mapper.Map<Post>(postContract);

        _logger.LogInformation("User {User} posts a post {PostId}", _claim, post.ID);

        var result = await _posts.AddPost(_claim, post);
        if (!result.IsError)
        {
            return CreatedAtAction("GetDetailed", new {id = result.Value.ID, key = result.Value.AccessKey}, result.Value);
        }

        return result.Map();
    }

    /// <summary>
    ///     Unpublish a post. (Requires auth. Required Admin,Moderator)
    /// </summary>
    [Authorize(Roles = "Admin,Moderator")]
    [HttpPost(ApiEndpoints.PostUnpublish)]
    public async Task<IActionResult> Unpublish(string id)
    {
        var result = await _posts.Unpublish(id, _claim);

        return Map<Post, PostResponseContract>(result);
    }

    /// <summary>
    ///     Publish a post. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpPost(ApiEndpoints.PostPublish)]
    public async Task<IActionResult> Publish(string id)
    {
        var result = await _posts.Publish(id, _claim);

        return Map<Post, PostResponseContract>(result);
    }

    /// <summary>
    ///     Update post. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpPatch(ApiEndpoints.PostsUpdatePost)]
    [ProducesResponseType(typeof(PostResponseContract), StatusCodes.Status200OK, "application/json")]
    public async Task<IActionResult> UpdatePost([FromBody] PostUpdateRequestContract updateContract, string id)
    {
        var result = await _posts.UpdatePost(_claim, updateContract, id);

        return Map<Post, PostResponseContract>(result);
    }

    /// <summary>
    ///     Get full info about a page if you are the creator of the page, otherwise return cached version
    /// </summary>
    [HttpGet(ApiEndpoints.PostsDetailedPost)]
    [ProducesResponseType(typeof(PostResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(typeof(PostDetailedResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetailed(string id, [FromQuery] string key = "")
    {
        var result = await _posts.GetDetailedPost(_claim, id, key);

        return result.Map<object>(v =>
        {
            return v switch
            {
                PostRedis postRedis => _mapper.Map<PostDetailedResponseContract>(postRedis),
                Post post => _mapper.Map<PostResponseContract>(post),
                _ => throw new ArgumentOutOfRangeException(nameof(v), v, null)
            };
        });
    }

    #region Mongo
    /// <summary>
    ///     Get uncached post. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet(ApiEndpoints.PostsOneDatabasePost)]
    [ProducesResponseType(typeof(PostResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(string id)
    {
        _logger.LogInformation("User {User} requested a post from the database", _claim);

        var result = await _posts.Get(id);

        return Map<Post, PostResponseContract>(result);
    }

    /// <summary>
    ///     Get all uncached posts. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet(ApiEndpoints.PostsAllDatabasePosts)]
    public async Task<List<PostResponseContract>> Get()
    {
        _logger.LogInformation("User {User} requested database posts dump", _claim);

        return _mapper.Map<List<Post>, List<PostResponseContract>>(await _posts.GetAll());
    }
    #endregion

    #region Cache
    /// <summary>
    ///     Get all posts. (Requires auth, Requires Admin/Moderator role)
    /// </summary>
    [Authorize(Roles = "Admin,Moderator")]
    [HttpGet(ApiEndpoints.PostsAllCachedPosts)]
    public async Task<PostMinimalResponseContract[]> GetCached()
    {
        _logger.LogInformation("User {User} requested posts cache dump", _claim);

        return _mapper.Map<PostRedis[], PostMinimalResponseContract[]>(await _posts.GetAllCached());
    }

    /// <summary>
    ///     Get a post.
    /// </summary>
    [Authorize(Roles = "Admin,Moderator")]
    [HttpGet(ApiEndpoints.PostsOneCachedPost)]
    [ProducesResponseType(typeof(PostMinimalResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCachedPost(string id)
    {
        var post = await _posts.GetCachedPost(id);

        return Map<PostRedis, PostMinimalResponseContract>(post);
    }
    #endregion
}
