using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Models;
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
    private readonly ILogger<PostsController> _logger;
    private readonly IMapper _mapper;
    private readonly PostsService _posts;

    public PostsController(ILogger<PostsController> logger, PostsService posts, IMapper mapper)
    {
        _logger = logger;
        _posts = posts;
        _mapper = mapper;
    }

    private IActionResult Error<T>(Result<T> result)
    {
        return result.IsError ? StatusCode((int) result.StatusCode, new {error = result.Message}) : Ok(result.Value);
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

        return postResult.IsError ? Error(postResult) : Ok();
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
        return result.IsError ? Error(result) : CreatedAtAction("GetCachedPost", new {id = result.Value.ID}, result.Value);
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

        return result.IsError ? Error(result) : Ok(_mapper.Map<PostResponseContract>(result.Value));
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
            return resultCached.IsError ? Error(resultCached) : Ok(_mapper.Map<PostDetailedResponseContract>(resultCached.Value));
        }

        var result = await _posts.GetDetailedPost(claim, id, key);
        if (result.IsError)
        {
            return Error(result);
        }

        return result.Value switch
        {
            PostRedis postRedis => Ok(_mapper.Map<PostDetailedResponseContract>(postRedis)),
            Post post => Ok(_mapper.Map<PostResponseContract>(post)),
            _ => BadRequest()
        };
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
        return result.IsError ? Error(result) : Ok(_mapper.Map<PostResponseContract>(result.Value));
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
        return post.IsError ? Error(post) : Ok(_mapper.Map<PostMinimalResponseContract>(post.Value));
    }

    /// <summary>
    ///     Get posts page.
    /// </summary>
    [HttpGet(ApiEndpoints.PostPage)]
    [ProducesResponseType(typeof(PostMinimalResponseContract[]), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetPage(int page, [FromQuery] int pageSize = 50, [FromQuery] PostFilter filter = PostFilter.Both)
    {
        if (pageSize > 50)
        {
            return BadRequest("Too many elements requested");
        }

        return Ok(_mapper.Map<PostRedis[], PostMinimalResponseContract[]>(await _posts.GetPage(page, pageSize, filter)));
    }
    #endregion
}
