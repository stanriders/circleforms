using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Contracts.ContractModels.Response.Posts;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Posts.Questions;
using CircleForms.Database.Services.Abstract;
using CircleForms.IO.FileIO.Abstract;
using MapsterMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Entities;

namespace CircleForms.ModelLayer;

public class PostsService
{
    private readonly ICacheRepository _cache;
    private readonly ILogger<PostsService> _logger;
    private readonly IMapper _mapper;
    private readonly IPostRepository _postRepository;
    private readonly IStaticFilesService _staticFilesService;

    public PostsService(ILogger<PostsService> logger, IStaticFilesService staticFilesService,
        IPostRepository postRepository, IMapper mapper, ICacheRepository cache)
    {
        _logger = logger;
        _staticFilesService = staticFilesService;
        _postRepository = postRepository;
        _mapper = mapper;
        _cache = cache;
    }

    private static void FillQuestions(Post post)
    {
        foreach (var question in post.Questions)
        {
            question.Id = ObjectId.GenerateNewId().ToString();
            if (question.QuestionType == QuestionType.Freeform)
            {
                question.QuestionInfo = new List<string>();
            }
        }

        ReorderQuestions(post.Questions);
    }

    private static void ReorderQuestions(IReadOnlyList<Question> questions)
    {
        for (var i = 0; i < questions.Count; i++)
        {
            questions[i].Order = i;
        }
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

    public async Task<Result<PostWithQuestionsContract>> AddPost(string userId, PostContract postRequest)
    {
        var post = _mapper.Map<Post>(postRequest);
        post.AuthorRelation = userId;
        if (post.Accessibility == Accessibility.Link)
        {
            post.AccessKey = GenerateAccessKey(6);
        }

        FillQuestions(post);

        var result = await _postRepository.Add(userId, post);

        return result is null
            ? Result<PostWithQuestionsContract>.Error("Can't add new post :/", HttpStatusCode.InternalServerError)
            : new Result<PostWithQuestionsContract>(_mapper.Map<PostWithQuestionsContract>(result));
    }


    public async Task<Result<PostWithQuestionsContract>> UpdatePost(string userId,
        PostContract updateContract, string id)
    {
        var post = await _postRepository.Get(id);
        if (post is null)
        {
            return Result<PostWithQuestionsContract>.NotFound(id);
        }

        if (post.AuthorRelation.ID != userId)
        {
            return Result<PostWithQuestionsContract>.Error("You can't update this post", HttpStatusCode.Unauthorized);
        }

        var updatedPost = _mapper.Map(updateContract, post);
        if (post.Published)
        {
            updateContract.Questions = post.Questions;
            updateContract.ActiveTo = post.ActiveTo;
        }
        else
        {
            FillQuestions(updatedPost);
        }

        _logger.LogInformation("User {Claim} updated the post {Id}", userId, post.ID);
        _logger.LogDebug("User {Claim} updated the post {Id} with {@Contract}", userId, post.ID, updateContract);

        await _postRepository.Update(updatedPost);
        await _cache.AddOrUpdate(updatedPost);
        if (updatedPost.Published)
        {
            await _cache.Publish(updatedPost);
        }

        return new Result<PostWithQuestionsContract>(_mapper.Map<PostWithQuestionsContract>(updatedPost));
    }

    private async Task<Result<PostRedis>> GetCachedPostPrivate(string id)
    {
        var post = await _cache.GetPost(id);
        if (post is null)
        {
            return Result<PostRedis>.NotFound(id);
        }

        post.AnswerCount = await _cache.GetAnswerCount(id);

        return new Result<PostRedis>(post);
    }

    //Produces: PostDetailedResponseContract | PostResponseContract
    public async Task<Result<object>> GetDetailedPost(string claim, string id, string key)
    {
        var cachedResult = await GetCachedPostPrivate(id);
        var cached = cachedResult.Value;

        if (string.IsNullOrEmpty(claim))
        {
            if (cachedResult.IsError)
            {
                return Result<object>.NotFound(id);
            }

            var contract = _mapper.Map<PostWithQuestionsContract>(cached);
            contract.AnswerCount = await _cache.GetAnswerCount(cached.ID);

            return new Result<object>(contract);
        }

        var post = await _postRepository.Get(id);
        if (post is null)
        {
            return Result<object>.NotFound(id);
        }

        if (post.AuthorId == claim)
        {
            return new Result<object>(_mapper.Map<FullPostContract>(post));
        }

        if (!post.Published || post.Accessibility == Accessibility.Link && key != post.AccessKey)
        {
            return Result<object>.NotFound(id);
        }

        var response = _mapper.Map<PostWithQuestionsContract>(post);
        var answer =  await post.Answers
            .ChildrenFluent()
            .Match(x => x.UserRelation.ID == claim)
            .FirstOrDefaultAsync();

        response.Answer = answer?.Submissions;

        return new Result<object>(response);
    }

    public async Task<List<PostWithQuestionsContract>> Get(List<string> ids)
    {
        var result = await _postRepository.Get(ids);

        return _mapper.Map<List<PostWithQuestionsContract>>(result);
    }

    public async Task<Result<FullPostContract>> Get(string id)
    {
        var post = await _postRepository.Get(id);

        if (post is null)
        {
            return Result<FullPostContract>.NotFound(id);
        }

        return new Result<FullPostContract>(_mapper.Map<FullPostContract>(post));
    }

    public async Task<List<FullPostContract>> GetAll()
    {
        var posts = await _postRepository.Get();

        return _mapper.Map<List<Post>, List<FullPostContract>>(posts);
    }

    public async Task<MinimalPostContract[]> GetAllCached()
    {
        return _mapper.Map<PostRedis[], MinimalPostContract[]>(
            await MapWithAnswerCounts(await _cache.GetDump()));
    }

    public Task<string[]> GetAllCachedIds()
    {
        return _cache.GetAllIds();
    }

    public async Task<Result<MinimalPostContract>> GetCachedPost(string id)
    {
        var post = await GetCachedPostPrivate(id);
        if (post.IsError)
        {
            return Result<MinimalPostContract>.Error(post.Errors);
        }

        return new Result<MinimalPostContract>(_mapper.Map<MinimalPostContract>(post));
    }

    public async Task<MinimalPostContract[]> GetPage(int page, int pageSize, PostFilter filter)
    {
        var posts = await _cache.GetPage(page, pageSize, filter);

        return _mapper.Map<PostRedis[], MinimalPostContract[]>(await MapWithAnswerCounts(posts));
    }

    public async Task<Maybe<Error>> SaveImage(string claim, string id, IFormFile image, ImageQuery query)
    {
        var post = await _postRepository.Get(id);
        if (post.AuthorRelation.ID != claim)
        {
            _logger.LogWarning("User {User} tries to upload an image to {Post} as non-author", claim, post.ID);

            return Maybe<Error>.Some(new Error("You can't upload images to this post", HttpStatusCode.Unauthorized));
        }

        await using var stream = image.OpenReadStream();
        var filename = await _staticFilesService.WriteImageAsync(stream, id, image.FileName, query);

        switch (query)
        {
            case ImageQuery.Icon:
                post.Icon = filename;

                break;
            case ImageQuery.Banner:
                post.Banner = filename;

                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(query), query, null);
        }

        await _postRepository.Update(post);
        await _cache.AddOrUpdate(post);

        return Maybe<Error>.None();
    }

    public async Task<Maybe<Error>> AddPinned(string postId)
    {
        var result = await _cache.PinPost(postId);

        return !result ? Maybe<Error>.Some(Error.NotFound(postId)) : Maybe<Error>.None();
    }

    public async Task<MinimalPostContract[]> GetPinned()
    {
        return _mapper.Map<PostRedis[], MinimalPostContract[]>(
            await MapWithAnswerCounts(await _cache.GetPinnedPosts()));
    }

    private async Task<PostRedis[]> MapWithAnswerCounts(PostRedis[] posts)
    {
        var tasks = new Task<int>[posts.Length];
        for (var i = 0; i < posts.Length; i++)
        {
            tasks[i] = _cache.GetAnswerCount(posts[i].ID);
        }

        var answerCounts = await Task.WhenAll(tasks);

        for (var i = 0; i < answerCounts.Length; i++)
        {
            posts[i].AnswerCount = answerCounts[i];
        }

        return posts;
    }


    public async Task<Maybe<Error>> DeletePost(string claim, string id)
    {
        var post = await _postRepository.Get(id);
        if (claim != post.AuthorId)
        {
            return Maybe<Error>.Some(Error.Forbidden());
        }

        if (post.Published)
        {
            return Maybe<Error>.Some(new Error("You can't delete published post", HttpStatusCode.BadRequest));
        }

        await post.DeleteAsync();
        return Maybe<Error>.None();
    }
}
