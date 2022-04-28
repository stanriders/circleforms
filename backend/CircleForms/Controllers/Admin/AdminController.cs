using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Users;
using CircleForms.Database.Services.Abstract;
using CircleForms.ModelLayer;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers.Admin;

[Authorize(Roles = $"{RoleConstants.SuperAdmin},{RoleConstants.Admin}")]
[ApiController]
[Route("admin")]
public class AdminController : ControllerBase
{
    private readonly ICacheRepository _cache;
    private readonly ILogger<AdminController> _logger;
    private readonly IMapper _mapper;
    private readonly IPostRepository _postRepository;
    private readonly PostsService _posts;
    private readonly IUserRepository _users;

    public AdminController(ILogger<AdminController> logger, IMapper mapper, IUserRepository users,
        ICacheRepository cache,
        PostsService posts, IPostRepository postRepository)
    {
        _logger = logger;
        _mapper = mapper;
        _users = users;
        _cache = cache;
        _posts = posts;
        _postRepository = postRepository;
    }

    private string _claim => HttpContext.User.Identity!.Name;

    [HttpPost("recache")]
    public async Task Recache()
    {
        await _cache.Purge();

        var posts = await _postRepository.Get();
        var publishTask = posts
            .Where(post => post.Published && post.Accessibility == Accessibility.Public)
            .Select(x => _cache.Publish(x));

        await Task.WhenAll(publishTask);

        var users = await _users.Get();
        var userPublishing = users.Select(x => _cache.AddUser(x));

        await Task.WhenAll(userPublishing);
    }

    /// <summary>
    ///     Get all users. (Requires auth, Requires Admin role)
    /// </summary>
    [HttpGet(ApiEndpoints.UsersGetAllUsers)]
    public async Task<List<UserContract>> GetAll()
    {
        _logger.LogInformation("Admin {Admin} requests users from the database", _claim);

        return _mapper.Map<List<User>, List<UserContract>>(await _users.Get());
    }


    /// <summary>
    ///     Set user role. (Requires auth, Requires SuperAdmin role)
    /// </summary>
    [Authorize(Roles = RoleConstants.SuperAdmin)]
    [HttpPatch(ApiEndpoints.UsersEscalateUserPrivileges)]
    [ProducesResponseType(typeof(UserContract), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> EscalatePrivileges([RegularExpression(@"^\d+$")] string id, int roles)
    {
        var role = (Roles) roles;
        if (role.HasFlag(Roles.SuperAdmin))
        {
            return BadRequest("You can not escalate user's role to SuperAdmin");
        }

        var user = await _users.Get(id);
        user.Roles = role;

        _logger.LogWarning("SuperAdmin {Admin} changes privileges of {Id} to {Role}", _claim,
            id, user.Roles.ToString());

        await _users.Update(id, user);

        return Ok(_mapper.Map<UserContract>(user));
    }

    #region Mongo
    /// <summary>
    ///     Get uncached post. (Requires auth, Requires Admin role)
    /// </summary>
    [HttpGet(ApiEndpoints.PostsOneDatabasePost)]
    [ProducesResponseType(typeof(FullPostContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(string id)
    {
        _logger.LogInformation("User {User} requested a post from the database", _claim);

        var result = await _posts.Get(id);

        return result.Unwrap();
    }

    /// <summary>
    ///     Get all uncached posts. (Requires auth, Requires Admin role)
    /// </summary>
    [HttpGet(ApiEndpoints.PostsAllDatabasePosts)]
    public async Task<List<FullPostContract>> Get()
    {
        _logger.LogInformation("User {User} requested database posts dump", _claim);

        var result = await _posts.GetAll();

        return result;
    }
    #endregion

    #region Cache
    /// <summary>
    ///     Get all posts. (Requires auth, Requires Admin role)
    /// </summary>
    [HttpGet(ApiEndpoints.PostsAllCachedPosts)]
    public async Task<PostMinimalContract[]> GetCached()
    {
        _logger.LogInformation("User {User} requested posts cache dump", _claim);

        var result = await _posts.GetAllCached();

        return result;
    }

    /// <summary>
    ///     Get a post.
    /// </summary>
    [HttpGet(ApiEndpoints.PostsOneCachedPost)]
    [ProducesResponseType(typeof(PostMinimalContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCachedPost(string id)
    {
        var post = await _posts.GetCachedPost(id);

        return post.Unwrap();
    }
    #endregion
}
