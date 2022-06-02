using System.IO;
using System.Threading.Tasks;
using CircleForms.Database.Models.Posts.Enums;

namespace CircleForms.IO.FileIO.Abstract;

public interface IStaticFilesService
{
    Task<string> WriteImageAsync(Stream image, string id, string filename, ImageQuery type);
}
