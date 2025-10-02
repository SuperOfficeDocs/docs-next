using Azure;
using Azure.Identity;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using Microsoft.Extensions.Options;
using SuperOffice.DocsNext.Extensions;
using SuperOffice.DocsNext.Configuration;
using SuperOffice.DocsNext.Models;
namespace SuperOffice.DocsNext.Services;

public interface IAzureSearchService
{
    Task<string[]> AutoCompleteAsync(string term, CancellationToken cancellationToken = default);
    Task<SearchResults<DocumentContent>> SearchDocumentsAsync(string query, string languages, int? pageNumber, CancellationToken cancellationToken = default);
}

public sealed class AzureSearchService : IAzureSearchService
{
    private readonly SearchClient _searchClient;
    private readonly AzureSearchOptions _options;
    private readonly string _suggesterName = "sg";

    public AzureSearchService(IOptions<AzureSearchOptions> options)
    {
        _options = options.Value;

        if (_options.UseApiKey && !string.IsNullOrEmpty(_options.ApiKey))
        {
            var credential = new AzureKeyCredential(_options.ApiKey);
            _searchClient = new SearchClient(_options.ServiceEndpoint, _options.IndexName, credential);
        }
        else
        {
            var credential = new DefaultAzureCredential();
            _searchClient = new SearchClient(_options.ServiceEndpoint, _options.IndexName, credential);
        }
    }

    public async Task<SearchResults<DocumentContent>> SearchDocumentsAsync(string query, string languages, int? pageNumber, CancellationToken cancellationToken = default)
    {

        int resultsPerPage = 20;

        var options = new SearchOptions
        {
            Size = resultsPerPage,
            Skip = ((pageNumber ?? 1) - 1) * resultsPerPage,
            IncludeTotalCount = true,
            Filter = GetLanguageFilterText(languages)
        };

        var response = await _searchClient.SearchAsync<DocumentContent>(query, options, cancellationToken);
        return response.Value;
    }

    // public async Task<IReadOnlyList<string>> SuggestAsync(string searchText, string languages, int size = 5, CancellationToken cancellationToken = default)
    // {
    //     var suggestOptions = new SuggestOptions
    //     {
    //         Size = size,
    //         UseFuzzyMatching = true
    //     };

    //     suggestOptions.Filter = GetLanguageFilterText(languages);

    //     // "sg" is the suggester name defined in your index
    //     var response = await _searchClient.SuggestAsync<SearchDocument>(searchText, _suggesterName, suggestOptions, cancellationToken);

    //     // Return the list of suggestion texts (e.g., from the "title" field)
    //     return response.Value.Results
    //         .Select(r => r.Text ?? "")
    //         .Where(s => !string.IsNullOrWhiteSpace(s))
    //         .Distinct()
    //         .ToList();
    // }

    public async Task<string[]> AutoCompleteAsync(string term, CancellationToken cancellationToken = default)
    {
        AutocompleteOptions ap = new AutocompleteOptions()
        {
            UseFuzzyMatching = false,
            Size = 5,
        };

        var autocompleteResult = await _searchClient.AutocompleteAsync(term, _suggesterName, ap, cancellationToken = default);

        return autocompleteResult.Value.Results.Select(x => x.Text).ToArray();
    }

   

    private string GetLanguageFilterText(string languages)
    {
        if (!string.IsNullOrWhiteSpace(languages))
        {
            return languages.Split(',')
                .Select(lang => $"language eq '{lang.ToLanguageName()}'")
                .Aggregate((current, next) => $"{current} or {next}");
        }
        else
        {
            return "language eq 'English'";
        }
    }

 

}
