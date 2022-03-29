using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Models.Posts;
using CircleForms.Models.Users;
using CircleForms.Services;
using CircleForms.Services.Database.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CircleForms.Controllers;

[ApiController]
[Route("[controller]")]
public class PagesController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly PostsService _posts;
    private readonly IUserRepository _users;

    public PagesController(IMapper mapper, PostsService posts, IUserRepository users)
    {
        _mapper = mapper;
        _posts = posts;
        _users = users;
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

        var authorIds = postsRedis
            .Select(x => x.AuthorId)
            .Distinct()
            .ToArray();

        var minimalAuthors = _mapper.Map<UserMinimalRedis[], UserMinimalResponseContract[]>(await Task.WhenAll(authorIds.Select(x => _users.GetMinimal(x))));

        for (var i = 0; i < minimalAuthors.Length; i++)
        {
            responseContract.Authors[authorIds[i]] = minimalAuthors[i];
        }

        var posts = _mapper.Map<PostRedis[], PostMinimalResponseContract[]>(postsRedis);
        responseContract.Posts = posts;

        return Ok(responseContract);
    }
}
