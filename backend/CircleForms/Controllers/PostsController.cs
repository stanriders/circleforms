using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions.Answers;
using CircleForms.Services.Database.Interfaces;
using Microsoft.AspNetCore.Authorization;
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


    [Authorize]
    [HttpPost("/posts")]
    public async Task<IActionResult> Post(Post post)
    {
        var claim = HttpContext.User.Identity?.Name;
        if (!string.IsNullOrEmpty(claim) && long.TryParse(claim, out var userId))
        {
            post.AuthorId = userId;
            var result = await _postRepository.Add(userId, post);

            if (result is null)
            {
                return StatusCode(500);
            }

            return CreatedAtAction("GetPostForUser", new {id = post.Id.ToString()}, result);
        }

        _logger.LogWarning("User had an invalid name claim: {Claim}", claim);

        return BadRequest();
    }

    #region Mongo
    [Authorize(Roles = "Admin")]
    [HttpGet("/posts/mongo/{id}")]
    public async Task<Post> Get(string id)
    {
        return await _postRepository.Get(id);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("/posts/mongo")]
    public async Task<List<Post>> Get()
    {
        return await _postRepository.Get();
    }
    #endregion

    #region Cache
    [Authorize(Roles = "Admin,Moderator")]
    [HttpGet("/posts")]
    public async Task<PostRedis[]> GetCached()
    {
        return await _postRepository.GetCached();
    }

    [HttpGet("/posts/{id}")]
    public async Task<Post> GetPostForUser(string id)
    {
        var post = await _postRepository.Get(id);
        foreach (var question in post.Questions)
        {
            question.Answers = null;
        }

        return post;
    }

    [Authorize]
    [HttpPost("/posts/{id}/answer")]
    public async Task<IActionResult> Answer(string id, [FromBody] List<AnswerContract> answers)
    {
        var claim = HttpContext.User.Identity?.Name;
        if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out var userId))
        {
            _logger.LogWarning("User had an invalid name claim on answer: {Claim}", claim);

            return BadRequest();
        }

        Post ProcessAnswer(Post post)
        {
            if (post.Questions.Any(x => x.Answers.Any(v => v.UserId == userId)))
            {
                return null;
            }

            var questions = post.Questions.ToDictionary(x => x.Id);
            var answersDictionary = answers.ToDictionary(x => x.QuestionId);
            foreach (var (key, value) in questions)
            {
                if (value.Optional)
                {
                    continue;
                }

                if (!answersDictionary.ContainsKey(key))
                {
                    return null;
                }
            }

            foreach (var (key, value) in answersDictionary)
            {
                if (!questions.TryGetValue(key, out var question) || value.Answer is null)
                {
                    return null;
                }

                var answer = _mapper.Map<Answer>((question.QuestionType, value));
                if (answer.Value is null)
                {
                    return null;
                }

                answer.UserId = userId;
                question.Answers.Add(answer);
            }

            return post;
        }

        var res = await _postRepository.UpdateWithLocked(id, ProcessAnswer, false);

        if (res is null)
        {
            return BadRequest();
        }

        return Ok();
    }

    [HttpGet("/posts/page/{page:int}")]
    public async Task<PostRedis[]> GetPage(int page)
    {
        return await _postRepository.GetCachedPage(page);
    }
    #endregion
}
