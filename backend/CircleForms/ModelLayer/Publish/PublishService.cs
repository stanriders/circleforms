using System;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Contracts.ContractModels.Response;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Services.Abstract;

namespace CircleForms.ModelLayer.Publish;

public class PublishService : IPublishService
{
    private readonly IMapper _mapper;
    private readonly IPostRepository _postRepository;
    private readonly ICacheRepository _cache;

    public PublishService(IMapper mapper, IPostRepository postRepository, ICacheRepository cache)
    {
        _mapper = mapper;
        _postRepository = postRepository;
        _cache = cache;
    }

    public async Task<Result<PostResponseContract>> Publish(string id, string claim)
    {
        var postResult = await GetAndValidate(id, claim);
        if (postResult.IsError)
        {
            return new Result<PostResponseContract>(postResult.StatusCode, postResult.Message);
        }

        var post = postResult.Value;
        if (post.Published)
        {
            return _mapper.Map<PostResponseContract>(post);
        }

        post.Published = true;
        post.PublishTime = DateTime.UtcNow;
        await _postRepository.Update(post);
        if (post.Accessibility == Accessibility.Public)
        {
            await _cache.Publish(post);
        }

        return _mapper.Map<PostResponseContract>(post);
    }

    public async Task<Result<PostResponseContract>> Unpublish(string id, string claim)
    {
        var postResult = await GetAndValidate(id, claim);
        if (postResult.IsError)
        {
            return new Result<PostResponseContract>(postResult.StatusCode, postResult.Message);
        }

        var post = postResult.Value;
        if (!post.Published)
        {
            return _mapper.Map<PostResponseContract>(post);
        }

        post.Published = false;
        await _postRepository.Update(post);
        await _cache.Unpublish(post.ID);

        return _mapper.Map<PostResponseContract>(post);
    }

    private async Task<Result<Post>> GetAndValidate(string id, string claim)
    {
        var post = await _postRepository.Get(id);
        if (post is null || post.AuthorRelation.ID != claim)
        {
            return Result<Post>.NotFound(id);
        }

        return post;
    }
}
