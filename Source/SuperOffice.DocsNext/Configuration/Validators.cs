using Microsoft.Extensions.Options;

namespace SuperOffice.DocsNext.Configuration
{
    public sealed class AzureSearchOptionsValidator : IValidateOptions<AzureSearchOptions>
    {
        public ValidateOptionsResult Validate(string? name, AzureSearchOptions options)
        {
            var failures = new List<string>();

            if (string.IsNullOrWhiteSpace(options.ServiceName))
                failures.Add("AzureSearch:ServiceName is required");

            if (string.IsNullOrWhiteSpace(options.IndexName))
                failures.Add("AzureSearch:IndexName is required");

            if (options.UseApiKey && string.IsNullOrWhiteSpace(options.ApiKey))
                failures.Add("AzureSearch:ApiKey is required when UseApiKey is true");

            return failures.Count > 0
                ? ValidateOptionsResult.Fail(failures)
                : ValidateOptionsResult.Success;
        }
    }
}
