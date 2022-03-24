using System.IO;
using System.Threading.Tasks;

namespace CircleForms.Services.IO;

public interface IStaticFilesService
{
    Task WriteImageAsync(Stream image, string id, string filename);
}
