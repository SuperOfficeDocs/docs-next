namespace SuperOffice.DocsNext.Configuration;

public sealed record AzureSearchOptions
{
    public const string SectionName = "AzureSearch";

    public required string ServiceName { get; init; }
    public required string IndexName { get; init; }
    public bool UseApiKey { get; init; } = false;
    public string? ApiKey { get; init; }

    public Uri ServiceEndpoint => new($"https://{ServiceName}.search.windows.net");
}