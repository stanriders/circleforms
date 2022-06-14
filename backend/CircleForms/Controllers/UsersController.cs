using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using CircleForms.Contracts;
using CircleForms.Contracts.Response.Compound;
using CircleForms.Contracts.Response.Posts;
using CircleForms.Contracts.Response.Users;
using CircleForms.Database.Services.Abstract;
using CircleForms.Domain;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace CircleForms.Controllers;

[ApiController]
[Route("users")]
public class UsersController : ControllerBase
{
    private readonly ICacheRepository _cache;
    private readonly ILogger<UsersController> _logger;
    private readonly IMapper _mapper;
    private readonly PostsService _posts;
    private readonly IUserRepository _usersService;

    public UsersController(ILogger<UsersController> logger, IMapper mapper, PostsService posts, IUserRepository usersService,
        ICacheRepository cache)
    {
        _logger = logger;
        _mapper = mapper;
        _posts = posts;
        _usersService = usersService;
        _cache = cache;
    }

    private string _claim => HttpContext.User.Identity!.Name;

    /// <summary>
    ///     Get user data.
    /// </summary>
    [HttpGet(ApiEndpoints.UsersGetUser)]
    [ProducesResponseType(typeof(UserContract), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get([RegularExpression(@"^\d+$")] string id)
    {
        var user = await _usersService.Get(id);
        if (user != null)
        {
            return Ok(_mapper.Map<UserContract>(user));
        }

        return NotFound();
    }

    /// <summary>
    ///     Get user data.
    /// </summary>
    [HttpGet(ApiEndpoints.UsersGetMinimalUser)]
    [ProducesResponseType(typeof(UserMinimalContract), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMinimal([RegularExpression(@"^\d+$")] string id)
    {
        var user = await _cache.GetMinimalUser(id);
        if (user != null)
        {
            return Ok(_mapper.Map<UserMinimalContract>(user));
        }

        return NotFound();
    }

    /// <summary>
    ///     Get user's posts.
    /// </summary>
    [Authorize]
    [HttpGet(ApiEndpoints.UsersGetMePosts)]
    [ProducesResponseType(typeof(List<MinimalPostContract>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMePosts()
    {
        var user = await _usersService.Get(_claim);
        if (user != null)
        {
            var posts = await user.PostsRelation.ChildrenFluent()
                .ToListAsync();

            return Ok(_mapper.Map<List<MinimalPostContract>>(posts));
        }

        _logger.LogCritical("User had a valid claim ({Claim}), but doesn't exist in the database!", _claim);

        await HttpContext.SignOutAsync("InternalCookies");

        return Unauthorized();
    }

    /// <summary>
    ///     Get user's answers
    /// </summary>
    [Authorize]
    [HttpGet(ApiEndpoints.UsersGetMeAnswers)]
    [ProducesResponseType(typeof(List<AnswerPostContract>), StatusCodes.Status200OK)]
    public async Task<List<AnswerPostContract>> GetMeAnswers()
    {
        var user = await _usersService.Get(_claim);
        var answers = await user.Answers.ChildrenFluent().ToListAsync();

        var posts = await _posts.Get(answers.Select(x => x.PostRelation.ID).ToList());
        var result = posts.Select(post =>
            new AnswerPostContract
            {
                Answer = answers.FirstOrDefault(x => x.PostRelation.ID == post.ID)?.Submissions,
                Post = post
            }
        );

        return result.ToList();
    }

    /// <summary>
    ///     Get data for current user.
    /// </summary>
    [Authorize]
    [HttpGet(ApiEndpoints.UsersGetMe)]
    [ProducesResponseType(typeof(UserContract), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMe()
    {
        _logger.LogInformation("User {User} requests /me", _claim);

        var user = await _usersService.Get(_claim);
        if (user != null)
        {
            var result = _mapper.Map<UserContract>(user);

            return Ok(result);
        }

        _logger.LogWarning("User had a valid claim ({Claim}), but doesn't exist in the database!", _claim);

        await HttpContext.SignOutAsync("InternalCookies");

        return Unauthorized();
    }
}
