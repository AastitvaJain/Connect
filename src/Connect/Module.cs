using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Connect.Accounts;
using Connect.Admins;
using Connect.ClientTokens;
using Connect.Configs;
using Connect.Inventories;
using Connect.Leads;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using Unchase.Swashbuckle.AspNetCore.Extensions.Extensions;

namespace Connect;

internal static class Module
{
    public static void ConfigureApp(this WebApplicationBuilder builder)
    {
        IServices services = builder.Services;
        IConfiguration config = builder.Configuration;
        
        services.AddSingleton<ITimer, Timer>();

        services.ConfigureCors();
        
        if (builder.Environment.IsDevelopment() || builder.Environment.IsProduction())
        {
            services.ConfigureSwagger();
        }
        
        services.ConfigureAuth(config);
        services.ConfigureSql(config);
        
        services.ConfigureJsonSerializer();

        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
        });
        
        services.ConfigureAccountModule();
        services.ConfigureConfigsModule();
        services.ConfigureInventoriesModule();
        services.ConfigureClientTokenModule();
        services.ConfigureLeadsModule();

        services.ConfigureAdminModule();
    }
    
    public static void MapMiddlewares(this WebApplication app)
    {
        app.UseCors("AnyOrigin");

        if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
        {
            app.UseSwagger(options =>
            {
                options.RouteTemplate = "docs/{documentName}/swagger.json";
            });

            app.UseSwaggerUI(options =>
            {
                options.RoutePrefix = "docs";
                options.SwaggerEndpoint("/docs/v1/swagger.json", "Connect");
            });
        }

        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor
        });

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseResponseCompression();
    }

    public static void MapEndpoints(this IEndpoints endpoints)
    {
        endpoints.MapAccountEndpoints();
        endpoints.MapConfigsEndpoints();
        endpoints.MapInventoriesEndpoints();
        endpoints.MapClientTokenEndpoints();
        endpoints.MapLeadsEndpoints();

        endpoints.MapAdminEndpoints();
    }
    
    private static void ConfigureCors(this IServices services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AnyOrigin", policy => policy
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithExposedHeaders(HeaderNames.RetryAfter)
                .SetPreflightMaxAge(TimeSpan.FromDays(1)));
        });
    }
    
    private static void ConfigureSwagger(this IServices services)
    {
        services
            .AddEndpointsApiExplorer()
            .AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Connect", Version = "v1"
                });

                options.CustomSchemaIds(type => type.FullName);

                options.MapType(typeof(DateOnly),
                    () => new OpenApiSchema
                    {
                        Type = "string", Format = "yyyy-MM-dd"
                    });

                options.AddEnumsWithValuesFixFilters();

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Description = "Enter the Bearer Authorization string as following: " +
                                  "`Bearer Generated-JWT-Token`",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                            Reference = new OpenApiReference
                            {
                                Id = "Bearer", Type = ReferenceType.SecurityScheme
                            }
                        },
                        new List<string>()
                    }
                });
            });
    }

    private static void ConfigureAuth(this IServices services, IConfiguration config)
    {
        JwtSection? data = config.GetRequiredSection("Jwt").Get<JwtSection>();

        if (data is null || !data.IsValid())
        {
            throw new InvalidDataException(nameof(data));
        }
        
        AuthConfig authConfig = new(
            data.Issuer,
            data.Audience,
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(data.Secret)));
        
        services.AddSingleton(authConfig);
        
        TokenValidationParameters parameters = new()
        {
            NameClaimType = "i",
            ValidateIssuer = true,
            ValidIssuer = authConfig.Issuer,
            ValidAudience = authConfig.Audience,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = authConfig.SecretKey,
            RequireExpirationTime = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(5)
        };

        services.AddSingleton(parameters);

        services
            .AddAuthentication()
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = parameters;

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        StringValues accessToken = context.Request.Query["access_token"];

                        if (!string.IsNullOrEmpty(accessToken) &&
                            context.HttpContext.Request.Path.StartsWithSegments("/hubs"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("User", policy => policy.RequireClaim("i"));
            options.AddPolicy("Admin", policy => policy.RequireClaim("a"));
        });
    }
    
    private static void ConfigureJsonSerializer(this IServices services)
    {
        services.Configure<JsonOptions>(options =>
        {
            options.SerializerOptions.PropertyNamingPolicy =
                JsonNamingPolicy.CamelCase;

            options.SerializerOptions.DefaultIgnoreCondition =
                JsonIgnoreCondition.WhenWritingNull;

            options.SerializerOptions.Converters
                .Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));

            options.SerializerOptions.IncludeFields = true;
        });
    }
    
    private static void ConfigureSql(this IServices services, IConfiguration config)
    {
        SqlSection? data = config.GetRequiredSection("Db").Get<SqlSection>();

        if (data is null || !data.IsValid())
        {
            throw new InvalidDataException(nameof(data));
        }
        
        DbConfig dbConfig = new (data.Server, data.Port, data.Database, data.User, data.Password);

        services.AddSingleton(dbConfig);

        services.AddDbContext<ConnectDbContext>(options =>
        {
            var connectionString = $"Host={dbConfig.Server};" +
                                   $"Port={dbConfig.Port};" +
                                   $"Database={dbConfig.Database};" +
                                   $"Username={dbConfig.User};" +
                                   $"Password={dbConfig.Password};" +
                                   $"SslMode=Prefer;";

            options.UseNpgsql(connectionString);
        });
    }
}