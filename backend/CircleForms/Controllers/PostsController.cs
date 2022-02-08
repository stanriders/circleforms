using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Commands;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts;
using CircleForms.Queries.Cache;
using CircleForms.Queries.Database;
using MediatR;
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
    private readonly IMediator _mediator;

    public PostsController(ILogger<PostsController> logger, IMapper mapper, IMediator mediator)
    {
        _logger = logger;
        _mapper = mapper;
        _mediator = mediator;
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

        var response = await _mediator.Send(new AddAnswerCommand(id, claim, answerContracts));
        if (response.StatusCode != 200)
        {
            return StatusCode(response.StatusCode, new {error = response.Error});
        }

        return Ok();
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

        var post = await _mediator.Send(new AddPostCommand(postContract, claim));
        if (post.StatusCode != 200)
        {
            return StatusCode(post.StatusCode, new {error = post.Error});
        }

        return CreatedAtAction("GetCachedPost", new {id = post.Data}, post.Data);
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

        var post = await _mediator.Send(new UpdatePostCommand(updateContract, id, claim));
        if (post.StatusCode != 200)
        {
            return StatusCode(post.StatusCode, new {error = post.Error});
        }

        return Ok(_mapper.Map<PostResponseContract>(post.Data));
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
        var cached = await _mediator.Send(new GetCachedPostQuery(id));
        if (cached is null)
        {
            return NotFound();
        }

        Post forceRequestedPost = null;
        if (cached.Accessibility == Accessibility.Link)
        {
            if (string.IsNullOrEmpty(key))
            {
                return NotFound();
            }

            forceRequestedPost = await _mediator.Send(new GetPostQuery(id));
            if (forceRequestedPost.AccessKey != key)
            {
                return NotFound();
            }
        }

        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out _))
        {
            return Ok(_mapper.Map<PostDetailedResponseContract>(cached));
        }

        return cached.AuthorId == claim
            ? Ok(_mapper.Map<PostResponseContract>(forceRequestedPost ?? await _mediator.Send(new GetPostQuery(id))))
            : Ok(_mapper.Map<PostDetailedResponseContract>(cached));
    }

    #region Mongo
    /// <summary>
    ///     Get uncached post. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet(ApiEndpoints.PostsOneDatabasePost)]
    public async Task<PostResponseContract> Get(string id)
    {
        _logger.LogInformation("User {User} requested a post from the database", HttpContext.User.Identity?.Name);

        var post = await _mediator.Send(new GetPostQuery(id));

        return _mapper.Map<PostResponseContract>(post);
    }

    /// <summary>
    ///     Get all uncached posts. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet(ApiEndpoints.PostsAllDatabasePosts)]
    public async Task<List<PostResponseContract>> Get()
    {
        _logger.LogInformation("User {User} requested database posts dump", HttpContext.User.Identity?.Name);

        var posts = await _mediator.Send(new GetAllPostsQuery());

        return _mapper.Map<List<Post>, List<PostResponseContract>>(posts);
    }
    #endregion

    #region Cache
    /// <summary>
    ///     Get all posts. (Requires auth, Requires Admin/Moderator role)
    /// </summary>
    [Authorize(Roles = "Admin,Moderator")]
    [HttpGet(ApiEndpoints.PostsAllCachedPosts)]
    public async Task<List<PostMinimalResponseContract>> GetCached()
    {
        _logger.LogInformation("User {User} requested posts cache dump", HttpContext.User.Identity?.Name);

        var posts = await _mediator.Send(new GetAllCachedPostsQuery());

        return _mapper.Map<List<PostRedis>, List<PostMinimalResponseContract>>(posts);
    }

    /// <summary>
    ///     Get a post.
    /// </summary>
    [HttpGet(ApiEndpoints.PostsOneCachedPost)]
    [ProducesResponseType(typeof(PostMinimalResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCachedPost(string id)
    {
        var post = await _mediator.Send(new GetCachedPostQuery(id));
        if (post == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<PostMinimalResponseContract>(post));
    }

    /// <summary>
    ///     Get posts page.
    /// </summary>
    [HttpGet(ApiEndpoints.PostPage)]
    public async Task<List<PostMinimalResponseContract>> GetPage(int page)
    {
        var posts = await _mediator.Send(new GetPageQuery(page));

        return _mapper.Map<List<PostRedis>, List<PostMinimalResponseContract>>(posts);
    }
    #endregion
}
