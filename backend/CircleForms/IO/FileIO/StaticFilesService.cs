using System;
using System.IO;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts.Enums;
using CircleForms.IO.FileIO.Abstract;
using CircleForms.IO.FileIO.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CircleForms.IO.FileIO;

public class StaticFilesService : IStaticFilesService
{
    private readonly StaticFilesConfig _config;
    private readonly ILogger<StaticFilesService> _logger;

    public StaticFilesService(IOptions<StaticFilesConfig> config, ILogger<StaticFilesService> logger)
    {
        _logger = logger;
        _config = config.Value;
    }

    public async Task<string> WriteImageAsync(Stream image, string id, string filename, ImageQuery type)
    {
        var name = type switch
        {
            ImageQuery.Icon => "icon",
            ImageQuery.Banner => "banner",
            _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
        };

        filename = Path.ChangeExtension(name, Path.GetExtension(filename));
        var directory = Path.GetFullPath(Path.Combine(_config.VolumePath, id));
        Directory.CreateDirectory(directory);

        var filePath = Path.Combine(directory, filename);
        _logger.LogDebug("Writing image to the static path {Path}", filename);
        await using var fileStream = File.OpenWrite(filePath);
        await image.CopyToAsync(fileStream);

        return filename;
    }
}
