using System;
using System.Collections.Generic;
using System.Linq;
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

    private static void ValidateQuestionOrder(IReadOnlyList<Question> questions)
    {
        var expected = questions[0].Order + 1;
        for (var i = 1; i < questions.Count; i++)
        {
            if (questions[i].Order != expected)
            {
                questions[i].Order = expected;
            }

            expected++;
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

        foreach (var question in post.Questions)
        {
            question.Id = ObjectId.GenerateNewId().ToString();
            if (question.QuestionType == QuestionType.Freeform)
            {
                question.QuestionInfo = new List<string>();
            }
        }

        ValidateQuestionOrder(post.Questions);

        var result = await _postRepository.Add(userId, post);

        return result is null
            ? new Result<PostWithQuestionsContract>(HttpStatusCode.InternalServerError, "Can't add new post :/")
            : new Result<PostWithQuestionsContract>(_mapper.Map<PostWithQuestionsContract>(result));
    }


    public async Task<Result<PostWithQuestionsContract>> UpdatePost(string userId,
        PostUpdateContract updateContract, string id)
    {
        var post = await _postRepository.Get(id);
        if (post.AuthorRelation.ID != userId)
        {
            return new Result<PostWithQuestionsContract>(HttpStatusCode.Unauthorized, "You can't update this post");
        }

        if (post.Published && updateContract.Questions is not null)
        {
            return new Result<PostWithQuestionsContract>("Question change is not allowed in published posts");
        }

        _logger.LogInformation("User {Claim} updated the post {Id}", userId, post.ID);
        _logger.LogDebug("User {Claim} updated the post {Id} with {@Contract}", userId, post.ID, updateContract);

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
                        return new Result<PostWithQuestionsContract>($"Question {updatedPostQuestion} is not found");
                    }

                    questions.Remove(question);

                    continue;
                }

                var newQuestion = _mapper.Map<Question>(updatedPostQuestion);
                //New question
                if (updatedPostQuestion.Id is null)
                {
                    newQuestion.Id = ObjectId.GenerateNewId().ToString();
                    if (newQuestion.QuestionType != QuestionType.Choice)
                    {
                        newQuestion.QuestionInfo = new List<string>();
                    }

                    questions.Add(newQuestion);

                    continue;
                }

                //Update question
                var postToUpdate = questions.FirstOrDefault(x => x.Id == updatedPostQuestion.Id);
                if (postToUpdate is null)
                {
                    return new Result<PostWithQuestionsContract>($"Question {updatedPostQuestion.Id} is not found");
                }

                questions.Remove(postToUpdate);
                questions.Add(newQuestion);
            }
        }

        questions.Sort((x, y) => x.Order.CompareTo(y.Order));

        ValidateQuestionOrder(questions);
        updatedPost.Questions = questions;

        await _postRepository.Update(post);
        await _cache.AddOrUpdate(post);
        if (post.Published)
        {
            await _cache.Publish(post);
        }

        return new Result<PostWithQuestionsContract>(_mapper.Map<PostWithQuestionsContract>(post));
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

            return _mapper.Map<PostWithQuestionsContract>(post);
        }

        if (post.Accessibility == Accessibility.Public)
        {
            return _mapper.Map<PostWithQuestionsContract>(post);
        }

        return Result<object>.NotFound(post.ID);
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

        var contract = _mapper.Map<FullPostContract>(post); //If author requests post

        return contract;
    }

    public async Task<Result<FullPostContract>> Get(string id)
    {
        var post = await _postRepository.Get(id);

        return _mapper.Map<FullPostContract>(post) ?? Result<FullPostContract>.NotFound(id);
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
            return new Result<MinimalPostContract>(post.StatusCode, post.Errors);
        }

        return _mapper.Map<MinimalPostContract>(post);
    }

    public async Task<MinimalPostContract[]> GetPage(int page, int pageSize, PostFilter filter)
    {
        var posts = await _cache.GetPage(page, pageSize, filter);

        return _mapper.Map<PostRedis[], MinimalPostContract[]>(await MapWithAnswerCounts(posts));
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


}
