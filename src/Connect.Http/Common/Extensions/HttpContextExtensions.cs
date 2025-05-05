using System.Net;
using System.Security.Claims;

namespace Connect;

public static class HttpContextExtensions
{
    public static Task Ok(this HttpContext context, string type, string value)
    {
        var response = new HttpResponseMessage(HttpStatusCode.OK);
        response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(type);
        context.Response.StatusCode = Status200OK;
        return context.Response.WriteAsync(value);
    }

    public static Task Ok<T>(this HttpContext context, T value)
    {
        context.Response.StatusCode = Status200OK;

        return context.Response.WriteAsJsonAsync(value);
    }

    public static Task Data<T>(this HttpContext context, T value, int statusCode)
    {
        context.Response.StatusCode = statusCode;

        return context.Response.WriteAsJsonAsync(value);
    }

    public static Task Status(this HttpContext context, int statusCode)
    {
        context.Response.StatusCode = statusCode;

        return Task.CompletedTask;
    }
    
    public static long? GetId(this HttpContext context)
    {
        string? value = context.Get(Jwt.Id);

        return value is not null ? long.Parse(value) : default;
    }
    
    private static string? Get(this HttpContext context, string key)
    {
        return context.User.FindFirstValue(key);
    }

    private static class Jwt
    {
        public const string Id = "i";
    }
}