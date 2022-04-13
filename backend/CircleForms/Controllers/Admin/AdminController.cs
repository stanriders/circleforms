using System.Linq;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Services.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CircleForms.Controllers.Admin;

[Authorize(Roles = "SuperAdmin,Admin")]
[ApiController]
[Route("admin")]
public class AdminController : ControllerBase
{
    private readonly ICacheRepository _cache;
    private readonly IPostRepository _posts;
    private readonly IUserRepository _users;

    public AdminController(IUserRepository users, ICacheRepository cache, IPostRepository posts)
    {
        _users = users;
        _cache = cache;
        _posts = posts;
    }

    [HttpPost("recache")]
    public async Task Recache()
    {
        await _cache.Purge();

        var posts = await _posts.Get();
        var publishTask = posts
            .Where(post => post.Published && post.Accessibility == Accessibility.Public)
            .Select(x => _cache.Publish(x));

        await Task.WhenAll(publishTask);

        var users = await _users.Get();
        var userPublishing = users.Select(x => _cache.AddUser(x));

        await Task.WhenAll(userPublishing);
    }
}
