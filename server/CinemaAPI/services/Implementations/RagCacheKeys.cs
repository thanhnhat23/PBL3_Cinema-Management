using System.Collections.Concurrent;

namespace CinemaAPI.Services.Implementations
{
    internal static class RagCacheKeys
    {
        private static readonly ConcurrentDictionary<string, int> Versions = new(StringComparer.OrdinalIgnoreCase);

        public static string Build(string scope, string category, string? keyword = null)
        {
            var normalizedKeyword = string.IsNullOrWhiteSpace(keyword)
                ? "all"
                : keyword.Trim().ToLowerInvariant();

            return $"{scope}:{category}:v{GetVersion(category)}:{normalizedKeyword}";
        }

        public static void Invalidate(params string[] categories)
        {
            foreach (var category in categories)
            {
                if (string.IsNullOrWhiteSpace(category))
                    continue;

                Versions.AddOrUpdate(category, 1, (_, current) => current == int.MaxValue ? 1 : current + 1);
            }
        }

        private static int GetVersion(string category) => Versions.GetOrAdd(category, 0);
    }
}