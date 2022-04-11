using System.IO;
using System.Threading.Tasks;

namespace CircleForms.IO.FileIO.Abstract;

public interface IStaticFilesService
{
    Task<string> WriteImageAsync(Stream image, string id, string filename);
}
