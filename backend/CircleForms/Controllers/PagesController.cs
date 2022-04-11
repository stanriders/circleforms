using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Users;
using CircleForms.Database.Services.Abstract;
using CircleForms.ModelLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CircleForms.Controllers;

[ApiController]
[Route("[controller]")]
public class PagesController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly PostsService _posts;
    private readonly ICacheRepository _cache;

    public PagesController(IMapper mapper, PostsService posts, ICacheRepository cache)
    {
        _mapper = mapper;
        _posts = posts;
        _cache = cache;
    }

    //TODO: Move it to PostService
    private async Task<PageResponseContract> FillResponseContract(PageResponseContract responseContract,
        PostRedis[] posts)
    {
        var authorIds = posts
            .Select(x => x.AuthorId)
            .Distinct()
            .ToArray();

        var minimalAuthors =
            _mapper.Map<UserMinimalRedis[], UserMinimalResponseContract[]>(
                await Task.WhenAll(authorIds.Select(x => _cache.GetMinimalUser(x))));

        for (var i = 0; i < minimalAuthors.Length; i++)
        {
            responseContract.Authors[authorIds[i]] = minimalAuthors[i];
        }

        var postsMinimal = _mapper.Map<PostRedis[], PostMinimalResponseContract[]>(posts);
        responseContract.Posts = postsMinimal;

        return responseContract;
    }

    /// <summary>
    ///     Get posts page.
    /// </summary>
    [HttpGet(ApiEndpoints.PostsPage)]
    [ProducesResponseType(typeof(PageResponseContract), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetPage(int page, [FromQuery] int pageSize = 50,
        [FromQuery] PostFilter filter = PostFilter.Both)
    {
        if (pageSize > 50)
        {
            return BadRequest("Too many elements requested");
        }

        var responseContract = new PageResponseContract
        {
            Authors = new Dictionary<string, UserMinimalResponseContract>(),
            Posts = Array.Empty<PostMinimalResponseContract>()
        };

        var postsRedis = await _posts.GetPage(page, pageSize, filter);

        if (postsRedis.Length == 0)
        {
            return Ok(responseContract);
        }

        return Ok(await FillResponseContract(responseContract, postsRedis));
    }

    /// <summary>
    ///     Get all pinned posts
    /// </summary>
    [HttpGet(ApiEndpoints.PostsPagePinned)]
    public async Task<PageResponseContract> GetPinned()
    {
        var posts = await _posts.GetPinned();

        return await FillResponseContract(new PageResponseContract(), posts);
    }

    /// <summary>
    ///     Add post to pinned posts. (Requires auth, Admin/Moderator role)"
    /// </summary>
    [HttpPost(ApiEndpoints.PostsPagePinned)]
    [Authorize(Roles = "Admin,Moderator")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PinPost(string post)
    {
        var result = await _posts.AddPinned(post);

        return result.Map();
    }
}
