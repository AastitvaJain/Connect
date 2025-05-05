using Connect;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.ConfigureApp();

await using WebApplication app = builder.Build();

app.MapMiddlewares();
app.MapEndpoints();

app.MapGet("/", () => "Connect API!");

await app.RunAsync();