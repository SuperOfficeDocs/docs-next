using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.SpaServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using SuperOffice.DocsNext.Configuration;
using SuperOffice.DocsNext.Services;
using System.Net;

var builder = WebApplication.CreateBuilder(args);


// Configuration
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .AddCommandLine(args);

var keyVaultName = builder.Configuration["keyVaultName"];
var vaultUri = new Uri($"https://{keyVaultName}.vault.azure.net/");
builder.Configuration.AddAzureKeyVault(vaultUri, new DefaultAzureCredential());

// Controllers
builder.Services.AddControllers();


// Options pattern + validation
builder.Services.Configure<AzureSearchOptions>(builder.Configuration.GetSection(AzureSearchOptions.SectionName));
builder.Services.AddSingleton<IValidateOptions<AzureSearchOptions>, AzureSearchOptionsValidator>();



// Dependency injection services
builder.Services.AddSingleton<IAzureSearchService, AzureSearchService>();


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("DocsOrigin", policy =>
    {
        policy.WithOrigins("https://docs.superoffice.com", "http://localhost:8080")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();


var app = builder.Build();


// Middleware pipeline

// Centralized exception handling
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var error = exceptionHandlerPathFeature?.Error;

        var problemDetails = new
        {
            title = "An unexpected error occurred.",
            status = 500,
            detail = error?.Message,
        };

        await context.Response.WriteAsJsonAsync(problemDetails);
    });
});

app.UseHttpsRedirection();
app.UseCors("DocsOrigin");

if (app.Environment.IsDevelopment())
{
    app.UseRouting();
    app.UseAuthorization();
    app.MapControllers();

    // Proxy to Astro dev server for frontend
    app.UseWhen(
        context => !context.Request.Path.StartsWithSegments("/api"),
        spaApp =>
        {
            spaApp.UseSpa(spa =>
            {
                spa.Options.SourcePath = "/ClientApp";
                spa.UseProxyToSpaDevelopmentServer("http://localhost:4321");
            });
        });
}
else
{
    var rewriteOptions = new RewriteOptions()
        // Redirect /something.html -> /something (permanent redirect)
        .AddRedirect(@"^(.*)\.html$", "$1", statusCode: 301)
        // Rewrite /something -> /something.html (internal rewrite)
        .AddRewrite(@"^([^.]+)$", "$1.html", skipRemainingRules: true);

    app.UseWhen(
        context => !context.Request.Path.StartsWithSegments("/api"),
        branch =>
        {
            branch.UseRewriter(rewriteOptions);
        }
    );

    app.UseDefaultFiles();
    app.UseStaticFiles();

    app.UseRouting();
    app.UseAuthorization();

    app.MapControllers();

    // SPA fallback for non-API paths
    // app.Use(async (context, next) =>
    // {
    //     await next();

    //     if (context.Response.StatusCode == 404 &&
    //         !context.Request.Path.StartsWithSegments("/api"))
    //     {
    //         context.Request.Path = "/index.html";
    //         await next();
    //     }
    // });
}

app.Run();
