using System;
using System.Threading.Tasks;
using CircleForms.Contracts.Response.Posts;
using CircleForms.Database.Models.Posts;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.Database.Services.Abstract;
using CircleForms.Domain.Jobs.Abstract;
using MapsterMapper;

namespace CircleForms.Domain.Publishing;

public class PublishService : IPublishService
{
    private readonly IActivityJob _activity;
    private readonly ICacheRepository _cache;
    private readonly IMapper _mapper;
    private readonly IPostRepository _postRepository;

    public PublishService(IActivityJob activity, IMapper mapper, IPostRepository postRepository, ICacheRepository cache)
    {
        _activity = activity;
        _mapper = mapper;
        _postRepository = postRepository;
        _cache = cache;
    }

    public async Task<Result<PostContract>> Publish(string id, string claim)
    {
        var postResult = await GetAndValidate(id, claim);
        if (postResult.IsError)
        {
            return Result<PostContract>.Error(postResult.Errors);
        }

        var post = postResult.Value;
        if (post.Published)
        {
            return new Result<PostContract>(_mapper.Map<PostContract>(post));
        }

        post.Published = true;
        post.PublishTime = DateTime.UtcNow;
        await _postRepository.Update(post);
        if (post.Accessibility == Accessibility.Public)
        {
            await _cache.Publish(post);
            _activity.EnqueueSetInactive(post.ID, post.ActiveTo);
        }

        return new Result<PostContract>(_mapper.Map<PostContract>(post));
    }

    public async Task<Result<PostContract>> Unpublish(string id, string claim)
    {
        var postResult = await GetAndValidate(id, claim);
        if (postResult.IsError)
        {
            return Result<PostContract>.Error(postResult.Errors);
        }

        var post = postResult.Value;
        if (!post.Published)
        {
            return new Result<PostContract>(_mapper.Map<PostContract>(post));
        }

        post.Published = false;
        await _postRepository.Update(post);
        await _cache.Unpublish(post.ID);

        return new Result<PostContract>(_mapper.Map<PostContract>(post));
    }

    private async Task<Result<Post>> GetAndValidate(string id, string claim)
    {
        var post = await _postRepository.Get(id);
        if (post is null || post.AuthorRelation.ID != claim)
        {
            return Result<Post>.NotFound(id);
        }

        return new Result<Post>(post);
    }
}
