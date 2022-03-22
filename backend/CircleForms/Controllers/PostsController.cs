using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Contracts;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using CircleForms.Models.Posts.Questions.Submissions;
using CircleForms.Queries;
using CircleForms.Queries.Cache;
using CircleForms.Queries.Database;
using CircleForms.Services.Database.Interfaces;
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
    private readonly IPostRepository _postRepository;

    public PostsController(ILogger<PostsController> logger, IPostRepository postRepository, IMapper mapper,
        IMediator mediator)
    {
        _logger = logger;
        _postRepository = postRepository;
        _mapper = mapper;
        _mediator = mediator;
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

    private static string GenerateAccessKey(byte size)
    {
        const string chars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        var data = new byte[size];
        using (var crypto = RandomNumberGenerator.Create())
        {
            crypto.GetBytes(data);
        }

        var result = new StringBuilder(size);
        foreach (var b in data)
        {
            result.Append(chars[b % chars.Length]);
        }

        return result.ToString();
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
            if (post.Accessibility == Accessibility.Link)
            {
                post.AccessKey = GenerateAccessKey(6);
            }

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

        var post = await _postRepository.Get(id);
        if (post.AuthorId != claim)
        {
            return Unauthorized();
        }

        _logger.LogInformation("User {Claim} updated the post {Id} with {@Updates}", claim, post.ID, updateContract);

        var questions = post.Questions;
        var updatedPost = _mapper.Map(updateContract, post);
        if (updateContract.Questions is not null)
        {
            foreach (var updatedPostQuestion in updateContract.Questions)
            {
                if (updatedPostQuestion.Delete)
                {
                    var question = questions.FirstOrDefault(x => x.Id == updatedPostQuestion.Id);
                    if (question is null)
                    {
                        return BadRequest($"Question {updatedPostQuestion.Id} is not found");
                    }

                    questions.Remove(question);

                    continue;
                }

                var newQuestion = _mapper.Map<Question>(updatedPostQuestion);
                if (updatedPostQuestion.Id is null)
                {
                    var newPostId = questions.Max(x => x.Id) + 1;
                    newQuestion.Id = newPostId;
                    questions.Add(newQuestion);

                    continue;
                }

                var postToUpdate = questions.FirstOrDefault(x => x.Id == updatedPostQuestion.Id);
                if (postToUpdate is null)
                {
                    return BadRequest($"Question {updatedPostQuestion.Id} is not found");
                }

                questions.Remove(postToUpdate);
                questions.Add(newQuestion);
            }
        }

        updatedPost.Questions = questions;

        await _postRepository.Update(post.ID, post, true);

        return Ok(_mapper.Map<PostResponseContract>(post));
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
        var post = await _postRepository.GetCached(id);
        if (post is null)
        {
            return NotFound();
        }

        Post forceRequestedPost = null;
        if (post.Accessibility == Accessibility.Link)
        {
            if (string.IsNullOrEmpty(key) || key.Length != 6)
            {
                return NotFound();
            }

            forceRequestedPost = await _postRepository.Get(id);
            if (forceRequestedPost.AccessKey != key)
            {
                return NotFound();
            }
        }

        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out _))
        {
            return Ok(_mapper.Map<PostDetailedResponseContract>(post));
        }

        return post.AuthorId == claim
            ? Ok(_mapper.Map<PostResponseContract>(forceRequestedPost ?? await _postRepository.Get(id)))
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
