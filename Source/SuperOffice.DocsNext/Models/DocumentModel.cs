using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using System.Text.Json.Serialization;

namespace SuperOffice.DocsNext.Models;

public sealed record DocumentContent
{
    [SimpleField(IsKey = true, IsFilterable = true, IsSortable = false, IsFacetable = false)]
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = false)]
    [JsonPropertyName("url")]
    public required string Url { get; init; }

    [SearchableField(IsSortable = true)]
    [JsonPropertyName("title")]
    public required string Title { get; init; }

    [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnMicrosoft, IsFilterable = false, IsSortable = false, IsFacetable = false)]
    [JsonPropertyName("content")]
    public required string Content { get; init; }

    [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnMicrosoft, IsFilterable = false, IsSortable = false, IsFacetable = false)]
    [JsonPropertyName("description")]
    public string? Description { get; init; }

    [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnMicrosoft, IsFilterable = false, IsSortable = false, IsFacetable = false)]
    [JsonPropertyName("headings")]
    public string[]? Headings { get; init; }

    [SimpleField(IsFilterable = true, IsSortable = true)]
    [JsonPropertyName("lastModified")]
    public DateTimeOffset? LastModified { get; init; }

    [SearchableField(IsFilterable = false, IsSortable = false, IsFacetable = false)]
    [JsonPropertyName("contentType")]
    public string ContentType { get; init; } = "text/html";

    [SimpleField(IsFilterable = true, IsSortable = true)]
    [JsonPropertyName("wordCount")]
    public int WordCount { get; init; }

    [SimpleField(IsFilterable = true, IsSortable = true)]
    [JsonPropertyName("indexedAt")]
    public DateTimeOffset IndexedAt { get; init; } = DateTimeOffset.UtcNow;

    [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
    [JsonPropertyName("language")]
    public string Language { get; init; } = "English";
}

public sealed record SitemapUrl(
    string Location, 
    DateTimeOffset? LastModified = null
);
