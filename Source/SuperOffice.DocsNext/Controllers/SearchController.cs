using Microsoft.AspNetCore.Mvc;
using SuperOffice.DocsNext.Services;

namespace SuperOffice.DocsNext.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Base URL: /search
    public class SearchController : ControllerBase
    {
        private readonly IAzureSearchService _searchService;

        public SearchController(
            IAzureSearchService searchService)
        {
            _searchService = searchService;
        }


        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] string? languages, [FromQuery] int? page, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Query parameter 'q' is required.");

            var results = await _searchService.SearchDocumentsAsync(q, languages ?? "English", page, cancellationToken);

            var totalCount = results.TotalCount ?? 0;
            var resultsPerPage = 20;
            var totalPages = (int)Math.Ceiling((double)totalCount / resultsPerPage);

            var response = new
            {
                Documents = results.GetResults().Select(r => r.Document),
                Pagination = new
                {
                    PageNumber = page,
                    PageSize = resultsPerPage,
                    TotalCount = totalCount,
                    TotalPages = totalPages
                }
            };
            return Ok(response);
        }

        [HttpGet("autocomplete")]
        public async Task<IActionResult> Autocomplete([FromQuery] string q, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Query parameter 'q' is required.");

            var results = await _searchService.AutoCompleteAsync(q, cancellationToken);
            return Ok(results);
        }
    }
}
