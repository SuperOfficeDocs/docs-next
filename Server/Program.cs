using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.SpaServices;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

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
                spa.Options.SourcePath = "../ClientApp";
                spa.UseProxyToSpaDevelopmentServer("http://localhost:4321");
            });
        });
}
else
{
    var rewriteOptions = new RewriteOptions()
        // Redirect /something.html -> /something   (permanent redirect)
        .AddRedirect(@"^(.*)\.html$", "$1", statusCode: 301)
        // Rewrite /something -> /something.html   (internal rewrite, no redirect)
        .AddRewrite(@"^([^.]+)$", "$1.html", skipRemainingRules: true);

    app.UseRewriter(rewriteOptions);

    app.UseDefaultFiles();
    app.UseStaticFiles();

    app.UseRouting();
    app.UseAuthorization();

    app.MapControllers();

    // SPA fallback for non-API paths
    app.Use(async (context, next) =>
    {
        await next();

        if (context.Response.StatusCode == 404 &&
            !context.Request.Path.StartsWithSegments("/api"))
        {
            context.Request.Path = "/index.html";
            await next();
        }
    });
}

app.Run();
