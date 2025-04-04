using FastExpressionCompiler;
using Mapster;
using MapsterMapper;

namespace CircleForms.Tests.Utils
{
    internal static class MappingHelper
    {
        public static IMapper CreateMapper()
        {
            TypeAdapterConfig.GlobalSettings.Scan(typeof(Program).Assembly);
            TypeAdapterConfig.GlobalSettings.Compiler = x => x.CompileFast();

            return new Mapper();
        }
    }
}
