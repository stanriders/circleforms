using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions.Answers;
using CircleForms.Services.Database.Interfaces;
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
    private readonly IPostRepository _postRepository;

    public PostsController(ILogger<PostsController> logger, IPostRepository postRepository, IMapper mapper)
    {
        _logger = logger;
        _postRepository = postRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Add a new post. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpPost("/posts")]
    [ProducesResponseType(typeof(Post), StatusCodes.Status201Created, "application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Post(Post post)
    {
        var claim = HttpContext.User.Identity?.Name;
        if (!string.IsNullOrEmpty(claim) && long.TryParse(claim, out var userId))
        {
            _logger.LogInformation("User {User} posts a post {PostId}", claim, post.Id);

            post.AuthorId = userId;
            var result = await _postRepository.Add(userId, post);

            if (result is null)
            {
                return StatusCode(500);
            }

            return CreatedAtAction("GetPostForUser", new {id = post.Id.ToString()}, result);
        }

        _logger.LogWarning("User had an invalid name claim: {Claim}", claim);

        return Unauthorized();
    }

    #region Mongo

    /// <summary>
    /// Get uncached post. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet("/posts/mongo/{id}")]
    public async Task<Post> Get(string id)
    {
        _logger.LogInformation("User {User} requested a post from the database", HttpContext.User.Identity?.Name);

        return await _postRepository.Get(id);
    }

    /// <summary>
    /// Get all uncached posts. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet("/posts/mongo")]
    public async Task<List<Post>> Get()
    {
        _logger.LogInformation("User {User} requested database posts dump", HttpContext.User.Identity?.Name);

        return await _postRepository.Get();
    }
    #endregion

    #region Cache

    /// <summary>
    /// Get all posts. (Requires auth, Requires Admin/Moderator role)
    /// </summary>
    [Authorize(Roles = "Admin,Moderator")]
    [HttpGet("/posts")]
    public async Task<PostRedis[]> GetCached()
    {
        _logger.LogInformation("User {User} requested posts cache dump", HttpContext.User.Identity?.Name);

        return await _postRepository.GetCached();
    }

    /// <summary>
    /// Get a post.
    /// </summary>
    [HttpGet("/posts/{id}")]
    [ProducesResponseType(typeof(Post), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPostForUser(string id)
    {
        var post = await _postRepository.Get(id);
        if (post != null)
        {
            foreach (var question in post.Questions)
            {
                question.Answers = null;
            }

            return Ok(post);
        }

        return NotFound();
    }

    private Post ProcessAnswer(Post post, IEnumerable<AnswerContract> answers, long userId)
    {
        //Check for repeating answers
        if (post.Questions.Any(x => x.Answers.Any(v => v.UserId == userId)))
        {
            return null;
        }

        var questions = post.Questions.ToDictionary(x => x.Id);
        var answersDictionary = answers.ToDictionary(x => x.QuestionId);

        //If any required fields doesn't filled
        if (post.Questions.Where(question => !question.Optional)
            .Any(question => !answersDictionary.ContainsKey(question.Id)))
        {
            return null;
        }

        foreach (var (key, value) in answersDictionary)
        {
            //If question with id doesn't exist or answer was not provided
            if (!questions.TryGetValue(key, out var question) || value.Answer is null)
            {
                return null;
            }

            var answer = _mapper.Map<Answer>((question.QuestionType, value));

            //If mapping failed
            if (answer.Value is null)
            {
                return null;
            }

            answer.UserId = userId;
            question.Answers.Add(answer);
        }

        return post;
    }

    /// <summary>
    /// Add answer to a question. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpPost("/posts/{id}/answer")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Answer(string id, [FromBody] List<AnswerContract> answers)
    {
        var claim = HttpContext.User.Identity?.Name;
        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out var userId))
        {
            _logger.LogWarning("User had an invalid name claim on answer: {Claim}", claim);

            return Unauthorized();
        }

        var res = await _postRepository.UpdateWithLocked(id, post => ProcessAnswer(post, answers, userId), false);

        if (res is null)
        {
            return BadRequest();
        }

        return Ok();
    }

    /// <summary>
    /// Get posts page.
    /// </summary>
    [HttpGet("/posts/page/{page:int}")]
    public async Task<PostRedis[]> GetPage(int page)
    {
        return await _postRepository.GetCachedPage(page);
    }
    #endregion
}
