using Microsoft.AspNetCore.Rewrite;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();
app.MapControllers();


if (app.Environment.IsDevelopment())
{
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

    // Serve static Astro files
    app.UseDefaultFiles();
    app.UseStaticFiles();


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
