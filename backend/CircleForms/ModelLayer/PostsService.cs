using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Controllers;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Models.Posts.Questions;
using CircleForms.Database.Services.Abstract;
using CircleForms.IO.FileIO.Abstract;
using MapsterMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace CircleForms.ModelLayer;

public class PostsService
{
    private readonly ICacheRepository _cache;
    private readonly ILogger<PostsController> _logger;
    private readonly IMapper _mapper;
    private readonly IPostRepository _postRepository;
    private readonly IStaticFilesService _staticFilesService;

    public PostsService(ILogger<PostsController> logger, IStaticFilesService staticFilesService,
        IPostRepository postRepository, IMapper mapper, ICacheRepository cache)
    {
        _logger = logger;
        _staticFilesService = staticFilesService;
        _postRepository = postRepository;
        _mapper = mapper;
        _cache = cache;
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

    public async Task<Result<PostDetailedResponseContract>> AddPost(string userId, PostRequestContract postRequest)
    {
        var post = _mapper.Map<Post>(postRequest);
        post.AuthorRelation = userId;
        post.IsActive = true;
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

        var result = await _postRepository.Add(userId, post);

        return result is null
            ? new Result<PostDetailedResponseContract>(HttpStatusCode.InternalServerError, "Can't add new post :/")
            : new Result<PostDetailedResponseContract>(_mapper.Map<PostDetailedResponseContract>(result));
    }


    public async Task<Result<PostDetailedResponseContract>> UpdatePost(string userId,
        PostUpdateRequestContract updateContract, string id)
    {
        var post = await _postRepository.Get(id);
        if (post.AuthorRelation.ID != userId)
        {
            return new Result<PostDetailedResponseContract>(HttpStatusCode.Unauthorized, "You can't update this post");
        }

        if (post.Published && updateContract.Questions is not null)
        {
            return new Result<PostDetailedResponseContract>("Question change is not allowed in published posts");
        }

        _logger.LogInformation("User {Claim} updated the post {Id}", userId, post.ID);
        _logger.LogDebug("User {Claim} updated the post {Id} with {Contract}", userId, post.ID, updateContract);

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
                        return new Result<PostDetailedResponseContract>($"Question {updatedPostQuestion} is not found");
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
                    return new Result<PostDetailedResponseContract>($"Question {updatedPostQuestion.Id} is not found");
                }

                questions.Remove(postToUpdate);
                questions.Add(newQuestion);
            }
        }

        updatedPost.Questions = questions;

        await _postRepository.Update(post);
        await _cache.AddOrUpdate(post);
        if (post.Published)
        {
            await _cache.Publish(post);
        }

        return new Result<PostDetailedResponseContract>(_mapper.Map<PostDetailedResponseContract>(post));
    }

    private async Task<Result<object>> DetailedPostResponseForNonAuthor(PostRedis post, string key,
        Post prefetchedPost = null)
    {
        if (post.Accessibility == Accessibility.Link)
        {
            if (prefetchedPost is null)
            {
                var privatePost = await _postRepository.Get(post.ID);
                if (privatePost is null)
                {
                    return Result<object>.NotFound(post.ID);
                }

                prefetchedPost = privatePost;
            }

            if (prefetchedPost.AccessKey != key || !prefetchedPost.Published)
            {
                return Result<object>.NotFound(post.ID);
            }

            return _mapper.Map<PostDetailedResponseContract>(post);
        }

        if (post.Accessibility == Accessibility.Public)
        {
            return _mapper.Map<PostDetailedResponseContract>(post);
        }

        return null;
    }

    private async Task<Result<PostRedis>> GetCachedPostPrivate(string id)
    {
        var post = await _cache.GetPost(id);
        if (post is null)
        {
            return Result<PostRedis>.NotFound(id);
        }

        post.AnswerCount = await _cache.GetAnswerCount(id);

        return post;
    }

    //Produces: PostDetailedResponseContract | PostResponseContract
    public async Task<Result<object>> GetDetailedPost(string claim, string id, string key)
    {
        var cachedResult = await GetCachedPostPrivate(id);
        var cached = cachedResult.Value;

        if (!cachedResult.IsError) //If post in cache (it means the post is public)
        {
            if (cached.AuthorId != claim)
            {
                return await DetailedPostResponseForNonAuthor(cached, key);
            }
        }

        //The post isn't public or author requests it
        var post = await _postRepository.Get(id);
        if (post is null)
        {
            return Result<object>.NotFound(id);
        }

        //If post isn't public and non-author requests it
        if (post.AuthorRelation.ID != claim)
        {
            return await DetailedPostResponseForNonAuthor(_mapper.Map<Post, PostRedis>(post), key, post);
        }

        var contract = _mapper.Map<PostResponseContract>(post); //If author requests post

        return contract;
    }

    public async Task<Result<PostResponseContract>> Get(string id)
    {
        var post = await _postRepository.Get(id);

        return _mapper.Map<PostResponseContract>(post) ?? Result<PostResponseContract>.NotFound(id);
    }

    public async Task<List<PostResponseContract>> GetAll()
    {
        var posts = await _postRepository.Get();

        return _mapper.Map<List<Post>, List<PostResponseContract>>(posts);
    }

    public async Task<PostMinimalResponseContract[]> GetAllCached()
    {
        return _mapper.Map<PostRedis[], PostMinimalResponseContract[]>(
            await MapWithAnswerCounts(await _cache.GetDump()));
    }

    public async Task<Result<PostMinimalResponseContract>> GetCachedPost(string id)
    {
        var post = await GetCachedPostPrivate(id);
        if (post.IsError)
        {
            return new Result<PostMinimalResponseContract>(post.StatusCode, post.Message);
        }

        return _mapper.Map<PostMinimalResponseContract>(post);
    }

    public async Task<PostMinimalResponseContract[]> GetPage(int page, int pageSize, PostFilter filter)
    {
        var posts = await _cache.GetPage(page, pageSize, filter);

        return _mapper.Map<PostRedis[], PostMinimalResponseContract[]>(await MapWithAnswerCounts(posts));
    }

    public async Task<Result<string>> SaveImage(string claim, string id, IFormFile image, ImageQuery query)
    {
        var post = await _postRepository.Get(id);
        if (post.AuthorRelation.ID != claim)
        {
            _logger.LogWarning("User {User} tries to upload an image to {Post} as non-author", claim, post.ID);

            return new Result<string>("You can't upload images to this post");
        }

        await using var stream = image.OpenReadStream();
        var filename = await _staticFilesService.WriteImageAsync(stream, id, image.FileName);

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

        return filename;
    }

    public async Task<Result<bool>> AddPinned(string postId)
    {
        var result = await _cache.PinPost(postId);

        return !result ? Result<bool>.NotFound(postId) : true;
    }

    public async Task<PostMinimalResponseContract[]> GetPinned()
    {
        return _mapper.Map<PostRedis[], PostMinimalResponseContract[]>(
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
}
