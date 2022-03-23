﻿using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Contracts.ContractModels.Request;
using CircleForms.Controllers;
using CircleForms.Models;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using CircleForms.Models.Posts.Questions.Submissions;
using CircleForms.Services.Database.Interfaces;
using Microsoft.Extensions.Logging;

namespace CircleForms.Services;

public class PostsService
{
    private readonly ILogger<PostsController> _logger;
    private readonly IMapper _mapper;
    private readonly IPostRepository _postRepository;

    public PostsService(ILogger<PostsController> logger, IPostRepository postRepository, IMapper mapper)
    {
        _logger = logger;
        _postRepository = postRepository;
        _mapper = mapper;
    }

    private Maybe<List<Submission>> ProcessAnswer(Post post,
        IEnumerable<SubmissionContract> answers)
    {
        var questions = post.Questions.ToDictionary(x => x.Id);
        var answersDictionary = answers.ToDictionary(x => x.QuestionId);

        //If any required fields doesn't filled
        if (post.Questions.Where(question => !question.Optional)
            .Any(question => !answersDictionary.ContainsKey(question.Id)))
        {
            return new Maybe<List<Submission>>("One or more required fields doesn't filled");
        }

        var resultingAnswers = new List<Submission>();
        foreach (var (key, value) in answersDictionary)
        {
            //If question with id doesn't exist or answer was not provided
            if (!questions.TryGetValue(key, out var question))
            {
                return new Maybe<List<Submission>>($"Question with id {key} does not exist");
            }

            if (question.QuestionType == QuestionType.Choice)
            {
                var choice = int.Parse(value.Answer);

                if (choice >= question.QuestionInfo.Count)
                {
                    return new Maybe<List<Submission>>($"Choice for {key} is not in the range of choice ids");
                }
            }

            var answer = _mapper.Map<Submission>(value);

            resultingAnswers.Add(answer);
        }

        return new Maybe<List<Submission>>(resultingAnswers);
    }


    public async Task<Maybe<bool>> Answer(string user, string id, IEnumerable<SubmissionContract> answerContracts)
    {
        var post = await _postRepository.Get(id);

        if (post is null)
        {
            return new Maybe<bool>(HttpStatusCode.BadRequest, "Could not find post with this id");
        }

        if (!post.IsActive)
        {
            return new Maybe<bool>(HttpStatusCode.Forbidden, "The post is inactive");
        }

        if (post.Answers.Any(x => x.ID == user))
        {
            return new Maybe<bool>(HttpStatusCode.Conflict, "You already voted");
        }

        var result = ProcessAnswer(post, answerContracts);
        if (result.IsError)
        {
            return new Maybe<bool>(result.StatusCode, result.Message);
        }

        var submissions = result.Value;

        var answer = new Answer
        {
            Submissions = submissions,
            ID = user
        };

        await _postRepository.AddAnswer(post.ID, answer);

        return new Maybe<bool>(true);
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

    public async Task<Maybe<Post>> AddPost(string userId, Post post)
    {
        post.AuthorId = userId;
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

        return result is null ? new Maybe<Post>(HttpStatusCode.InternalServerError, "Can't add new post :/") : new Maybe<Post>(post);
    }


    public async Task<Maybe<Post>> UpdatePost(string userId, PostUpdateRequestContract updateContract, string id)
    {
        var post = await _postRepository.Get(id);
        if (post.AuthorId != userId)
        {
            return new Maybe<Post>(HttpStatusCode.Unauthorized, "You can't update this post");
        }

        _logger.LogInformation("User {Claim} updated the post {Id} with {@Updates}", userId, post.ID, updateContract);

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
                        return new Maybe<Post>($"Question {updatedPostQuestion} is not found");
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
                    return new Maybe<Post>($"Question {updatedPostQuestion.Id} is not found");
                }

                questions.Remove(postToUpdate);
                questions.Add(newQuestion);
            }
        }

        updatedPost.Questions = questions;

        await _postRepository.Update(post.ID, post, true);

        return new Maybe<Post>(post);
    }

    public async Task<Maybe<object>> GetDetailedPost(string claim, string id, string key)
    {
        var cachedResult = await GetCachedPost(id);
        if (cachedResult.IsError)
        {
            return cachedResult;
        }

        var cached = cachedResult.Value;

        Post forceRequestedPost = null;
        if (cached.Accessibility == Accessibility.Link)
        {
            if (string.IsNullOrEmpty(key) || key.Length != 6)
            {
                return Maybe<object>.NotFound(id);
            }

            forceRequestedPost = await _postRepository.Get(id);
            if (forceRequestedPost.AccessKey != key)
            {
                return Maybe<object>.NotFound(id);
            }
        }

        return cached.AuthorId != claim ? cached : forceRequestedPost ?? await _postRepository.Get(id);
    }

    public async Task<Maybe<Post>> Get(string id)
    {
        var post = await _postRepository.Get(id);

        return post ?? Maybe<Post>.NotFound(id);
    }

    public async Task<List<Post>> GetAll()
    {
        return await _postRepository.Get();
    }

    public async Task<PostRedis[]> GetAllCached()
    {
        return await _postRepository.GetCached();
    }

    public async Task<Maybe<PostRedis>> GetCachedPost(string id)
    {
        var post = await _postRepository.GetCached(id);
        return post ?? Maybe<PostRedis>.NotFound(id);
    }

    public async Task<PostRedis[]> GetPage(int page, int pageSize, PostFilter filter)
    {
        return await _postRepository.GetCachedPage(page, pageSize, filter);
    }
}
