using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Contracts.V1;
using CircleForms.Contracts.V1.ContractModels.Request;
using CircleForms.Contracts.V1.ContractModels.Response;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using CircleForms.Models.Posts.Questions.Submissions;
using CircleForms.Services.Database.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CircleForms.Controllers.V1;

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

        var post = await _postRepository.Get(id);

        if (post is null)
        {
            return BadRequest(new {error = "Could not find post with this id"});
        }

        if (post.Answers.Any(x => x.ID == claim))
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
            ID = claim
        };

        await _postRepository.AddAnswer(post.ID, answer);

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
        if (!string.IsNullOrEmpty(claim) && long.TryParse(claim, out _))
        {
            var post = _mapper.Map<Post>(postContract);

            _logger.LogInformation("User {User} posts a post {PostId}", claim, post.ID);

            post.AuthorId = claim;

            for (var i = 0; i < post.Questions.Count; i++)
            {
                var question = post.Questions[i];
                question.Id = i;
                if (question.QuestionType != QuestionType.Choice)
                {
                    question.QuestionInfo = new List<string>();
                }
            }

            var result = await _postRepository.Add(claim, post);

            if (result is null)
            {
                return StatusCode(500);
            }

            return CreatedAtAction("GetCachedPost", new {id = post.ID}, result);
        }

        _logger.LogWarning("User had an invalid name claim: {Claim}", claim);

        return Unauthorized();
    }

    /// <summary>
    ///     Get full info about a page if you are the creator of the page, otherwise return cached version
    /// </summary>
    [HttpGet(ApiEndpoints.PostsDetailedPost)]
    [ProducesResponseType(typeof(PostResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(typeof(PostDetailedResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetailed(string id)
    {
        var claim = HttpContext.User.Identity?.Name;
        var post = await _postRepository.Get(id);
        if (post is null)
        {
            return NotFound();
        }

        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out _))
        {
            return Ok(_mapper.Map<PostDetailedResponseContract>(post));
        }

        return post.AuthorId == claim
            ? Ok(_mapper.Map<PostResponseContract>(await _postRepository.Get(id)))
            : Ok(_mapper.Map<PostDetailedResponseContract>(post));
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

        return _mapper.Map<PostResponseContract>(await _postRepository.Get(id));
    }

    /// <summary>
    ///     Get all uncached posts. (Requires auth, Requires Admin role)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet(ApiEndpoints.PostsAllDatabasePosts)]
    public async Task<List<PostResponseContract>> Get()
    {
        _logger.LogInformation("User {User} requested database posts dump", HttpContext.User.Identity?.Name);

        return _mapper.Map<List<Post>, List<PostResponseContract>>(await _postRepository.Get());
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

        return _mapper.Map<PostRedis[], PostMinimalResponseContract[]>(await _postRepository.GetCached());
    }

    /// <summary>
    ///     Get a post.
    /// </summary>
    [HttpGet(ApiEndpoints.PostsOneCachedPost)]
    [ProducesResponseType(typeof(PostMinimalResponseContract), StatusCodes.Status200OK, "application/json")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCachedPost(string id)
    {
        var post = await _postRepository.GetCached(id);
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
    public async Task<PostMinimalResponseContract[]> GetPage(int page)
    {
        return _mapper.Map<PostRedis[], PostMinimalResponseContract[]>(await _postRepository.GetCachedPage(page));
    }
    #endregion
}
