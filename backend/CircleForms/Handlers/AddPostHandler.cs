using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using CircleForms.Commands;
using CircleForms.Models.Enums;
using CircleForms.Models.Posts;
using CircleForms.Models.Posts.Questions;
using CircleForms.Services.Database.Interfaces;
using MediatR;

namespace CircleForms.Handlers;

public class AddPostHandler : IRequestHandler<AddPostCommand, CQRSResponse<Post>>
{
    private readonly IPostRepository _repository;
    private IMapper _mapper;

    public AddPostHandler(IPostRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
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

    public async Task<CQRSResponse<Post>> Handle(AddPostCommand request, CancellationToken cancellationToken)
    {
        var post = _mapper.Map<Post>(request.Contract);

        post.AuthorId = request.Claim;
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

        var result = await _repository.Add(request.Claim, post);

        return result is null ? new CQRSResponse<Post>(500, "Post is not added") : new CQRSResponse<Post>(result);
    }
}
