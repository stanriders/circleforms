using System;
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
        if (!ModelState.IsValid)
        {
            return BadRequest(new {errors = ModelState.Values.Select(x => x.Errors.Select(v => v.ErrorMessage))});
        }

        var claim = HttpContext.User.Identity?.Name;
        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out _))
        {
            _logger.LogWarning("User had an invalid name claim on answer: {Claim}", claim);

            return Unauthorized();
        }

        var postResult = await _posts.Answer(claim, id, answerContracts);

        return postResult.Map();
    }

    /// <summary>
    ///     Upload an image. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpPut(ApiEndpoints.PostUploadImage)]
    public async Task<IActionResult> UploadImage(string id, IFormFile image, [FromQuery] ImageQuery query)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new {errors = ModelState.Values.Select(x => x.Errors.Select(v => v.ErrorMessage))});
        }

        var claim = HttpContext.User.Identity?.Name;
        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out _))
        {
            _logger.LogWarning("User had an invalid name claim on answer: {Claim}", claim);

            return Unauthorized();
        }

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

        var result = await _posts.SaveImage(claim, id, image, query);

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
        if (!ModelState.IsValid)
        {
            return BadRequest(new {errors = ModelState.Values.Select(x => x.Errors.Select(v => v.ErrorMessage))});
        }

        var claim = HttpContext.User.Identity?.Name;
        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out _))
        {
            _logger.LogWarning("User had an invalid name claim: {Claim}", claim);

            return Unauthorized();
        }

        var post = _mapper.Map<Post>(postContract);

        _logger.LogInformation("User {User} posts a post {PostId}", claim, post.ID);

        var result = await _posts.AddPost(claim, post);
        if (!result.IsError)
        {
            return CreatedAtAction("GetDetailed", new {id = result.Value.ID}, result.Value);
        }

        return result.Map();
    }

    /// <summary>
    ///     Publish a post. (Requires auth)
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [Authorize]
    [HttpPost(ApiEndpoints.PostUnpublish)]
    public async Task<IActionResult> Unpublish(string id)
    {
        var claim = HttpContext.User.Identity?.Name;
        if (!ModelState.IsValid || string.IsNullOrEmpty(claim) || !long.TryParse(claim, out _))
        {
            return Unauthorized();
        }

        var result = await _posts.Unpublish(id, claim);

        return Map<Post, PostResponseContract>(result);
    }

    /// <summary>
    ///     Publish a post. (Requires auth)
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [Authorize]
    [HttpPost(ApiEndpoints.PostPublish)]
    public async Task<IActionResult> Publish(string id)
    {
        var claim = HttpContext.User.Identity?.Name;
        if (!ModelState.IsValid || string.IsNullOrEmpty(claim) || !long.TryParse(claim, out _))
        {
            return Unauthorized();
        }

        var result = await _posts.Publish(id, claim);

        return Map<Post, PostResponseContract>(result);
    }

    /// <summary>
    ///     Update post. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpPatch(ApiEndpoints.PostUpdatePost)]
    [ProducesResponseType(typeof(PostResponseContract), StatusCodes.Status200OK, "application/json")]
    public async Task<IActionResult> UpdatePost([FromBody] PostUpdateRequestContract updateContract, string id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var claim = HttpContext.User.Identity?.Name;
        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out _))
        {
            return Unauthorized();
        }

        var result = await _posts.UpdatePost(claim, updateContract, id);

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
        var claim = HttpContext.User.Identity?.Name;

        if (claim is null)
        {
            var resultCached = await _posts.GetCachedPost(id);

            return Map<PostRedis, PostDetailedResponseContract>(resultCached);
        }

        var result = await _posts.GetDetailedPost(claim, id, key);

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
        _logger.LogInformation("User {User} requested a post from the database", HttpContext.User.Identity?.Name);

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
        _logger.LogInformation("User {User} requested database posts dump", HttpContext.User.Identity?.Name);

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
        _logger.LogInformation("User {User} requested posts cache dump", HttpContext.User.Identity?.Name);

        return _mapper.Map<PostRedis[], PostMinimalResponseContract[]>(await _posts.GetAllCached());
    }

    /// <summary>
    ///     Get a post.
    /// </summary>
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
