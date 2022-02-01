using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using CircleForms.Models.Posts.Questions.Submissions;
using CircleForms.Services.Database.Interfaces;
using FluentValidation;
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
    private readonly IValidator<SubmissionContract> _submissionValidator;

    public PostsController(IValidator<SubmissionContract> submissionValidator, ILogger<PostsController> logger,
        IPostRepository postRepository, IMapper mapper)
    {
        _submissionValidator = submissionValidator;
        _logger = logger;
        _postRepository = postRepository;
        _mapper = mapper;
    }

    private (List<Submission> submissions, string error) ProcessAnswer(Post post,
        IEnumerable<SubmissionContract> answers)
    {
        var questions = post.Questions.ToDictionary(x => x.Id);
        var answersDictionary = answers.ToDictionary(x => x.QuestionId);

        //If any required fields doesn't filled
        if (post.Questions.Where(question => !question.Optional)
            .Any(question => !answersDictionary.ContainsKey(question.Id)))
        {
            return (null, "One or more required fields doesn't filled");
        }

        var resultingAnswers = new List<Submission>();
        foreach (var (key, value) in answersDictionary)
        {
            //If question with id doesn't exist or answer was not provided
            if (!questions.TryGetValue(key, out var question))
            {
                return (null, $"Question with id {key} does not exist");
            }

            if (question.QuestionType == QuestionType.Choice)
            {
                var choice = int.Parse(value.Answer);

                if (choice >= question.QuestionInfo.Count)
                {
                    return (null, $"Choice for {key} is not in the range of choice ids");
                }
            }

            var answer = _mapper.Map<Submission>(value);

            resultingAnswers.Add(answer);
        }

        return (resultingAnswers, null);
    }

    /// <summary>
    ///     Add answer to a question. (Requires auth)
    /// </summary>
    [Authorize]
    [HttpPost("/posts/{id}/answer")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Answer(string id, [FromBody] List<SubmissionContract> answerContracts)
    {
        var claim = HttpContext.User.Identity?.Name;
        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out var userId))
        {
            _logger.LogWarning("User had an invalid name claim on answer: {Claim}", claim);

            return Unauthorized();
        }

        var validationTasks = answerContracts.Select(x => _submissionValidator.ValidateAsync(x));
        var results = await Task.WhenAll(validationTasks);
        foreach (var validationResult in results)
        {
            if (!validationResult.IsValid)
            {
                return BadRequest(new {errors = validationResult.Errors.Select(x => x.ToString())});
            }
        }

        var post = await _postRepository.Get(id);

        if (post is null)
        {
            return BadRequest(new {error = "Could not find post with this id"});
        }

        if (post.Answers.Any(x => x.UserId == userId))
        {
            return Conflict(new {error = "You already voted"});
        }

        var (submissions, error) = ProcessAnswer(post, answerContracts);

        if (submissions is null)
        {
            return BadRequest(new {error});
        }

        var answer = new Answer
        {
            Submissions = submissions,
            UserId = userId
        };

        await _postRepository.AddAnswer(post.Id, answer);

        return Ok();
    }

    /// <summary>
    ///     Add a new post. (Requires auth)
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

            if (post.Questions.Count == 0)
            {
                return BadRequest("No questions provided");
            }

            for (var i = 0; i < post.Questions.Count; i++)
            {
                var question = post.Questions[i];
                question.Id = i;
                if (question.QuestionType == QuestionType.Choice)
                {
                    if (question.QuestionInfo.Count == 0)
                    {
                        return BadRequest($"Question {i} is choice, but no choices provided");
                    }

                    if (question.QuestionInfo.Any(string.IsNullOrWhiteSpace))
                    {
                        return BadRequest(
                            $"Question {i} is choice, but one of the choices consists exclusively of white-spaced characters");
                    }
                }
                else
                {
                    question.QuestionInfo = new List<string>();
                }
            }

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

    /// <summary>
    ///     Get full info about a page if you are the creator of the page, otherwise return cached version
    /// </summary>
    [HttpGet("/posts/{id}/detailed")]
    [ProducesResponseType(typeof(Post), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(typeof(PostRedis), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetailed(string id)
    {
        var claim = HttpContext.User.Identity?.Name;
        var cached = await _postRepository.GetCached(id);
        if (cached is null)
        {
            return NotFound();
        }

        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out var userId))
        {
            return Ok(cached);
        }

        return cached.AuthorId == userId ? Ok(await _postRepository.Get(id)) : Ok(cached);
    }

    #region Mongo
    /// <summary>
    ///     Get uncached post. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet("/posts/mongo/{id}")]
    public async Task<Post> Get(string id)
    {
        _logger.LogInformation("User {User} requested a post from the database", HttpContext.User.Identity?.Name);

        return await _postRepository.Get(id);
    }

    /// <summary>
    ///     Get all uncached posts. (Requires auth, Requires Admin role)
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
    ///     Get all posts. (Requires auth, Requires Admin/Moderator role)
    /// </summary>
    [Authorize(Roles = "Admin,Moderator")]
    [HttpGet("/posts")]
    public async Task<PostRedis[]> GetCached()
    {
        _logger.LogInformation("User {User} requested posts cache dump", HttpContext.User.Identity?.Name);

        return await _postRepository.GetCached();
    }

    /// <summary>
    ///     Get a post.
    /// </summary>
    [HttpGet("/posts/{id}")]
    [ProducesResponseType(typeof(Post), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPostForUser(string id)
    {
        var post = await _postRepository.Get(id);
        if (post == null)
        {
            return NotFound();
        }

        post.Answers = new List<Answer>();

        return Ok(post);
    }


    /// <summary>
    ///     Get posts page.
    /// </summary>
    [HttpGet("/posts/page/{page:int}")]
    public async Task<PostRedis[]> GetPage(int page)
    {
        return await _postRepository.GetCachedPage(page);
    }
    #endregion
}
