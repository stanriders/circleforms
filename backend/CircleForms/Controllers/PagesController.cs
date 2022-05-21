using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Response.Compound;
using CircleForms.Contracts.ContractModels.Response.Posts;
using CircleForms.Contracts.ContractModels.Response.Users;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Services.Abstract;
using CircleForms.ModelLayer;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;



namespace CircleForms.Controllers;

[ApiController]
[Route("[controller]")]
public class PagesController : ControllerBase
{
    private readonly ICacheRepository _cache;
    private readonly IMapper _mapper;
    private readonly PostsService _posts;

    public PagesController(IMapper mapper, PostsService posts, ICacheRepository cache)
    {
        _mapper = mapper;
        _posts = posts;
        _cache = cache;
    }

    //TODO: Move it to PostService
    private async Task<PageContract> FillResponseContract(PageContract responseContract,
        MinimalPostContract[] posts)
    {
        var authorIdsTasks = posts
            .Select(x => x.AuthorId)
            .Distinct()
            .Select(x => _cache.GetMinimalUser(x));

        var authors = await Task.WhenAll(authorIdsTasks);

        responseContract.Users = _mapper.Map<List<UserMinimalContract>>(authors);
        responseContract.Posts = posts;

        return responseContract;
    }

    /// <summary>
    ///     Get posts page.
    /// </summary>
    [HttpGet(ApiEndpoints.PostsPage)]
    [ProducesResponseType(typeof(PageContract), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetPage(int page, [FromQuery] int pageSize = 50,
        [FromQuery] PostFilter filter = PostFilter.Both)
    {
        if (pageSize > 50)
        {
            return BadRequest("Too many elements requested");
        }

        var responseContract = new PageContract
        {
            Users = new List<UserMinimalContract>(),
            Posts = Array.Empty<MinimalPostContract>()
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
    [ProducesResponseType(typeof(PageContract), StatusCodes.Status200OK)]
    public async Task<PageContract> GetPinned()
    {
        var posts = await _posts.GetPinned();

        var response = new PageContract
        {
            Users = new List<UserMinimalContract>(),
            Posts = Array.Empty<MinimalPostContract>()
        };

        if (posts.Length == 0)
        {
            return response;
        }

        return await FillResponseContract(response, posts);
    }

    /// <summary>
    ///     Add post to pinned posts.
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
