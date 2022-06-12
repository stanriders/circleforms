using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using CircleForms.Controllers.Authorization.Configuration;
using CircleForms.Database.Services;
using CircleForms.Database.Services.Abstract;
using CircleForms.Domain;
using CircleForms.Domain.Answers;
using CircleForms.Domain.Jobs.Abstract;
using CircleForms.Domain.Publishing;
using CircleForms.ExternalAPI.OsuApi;
using CircleForms.ExternalAPI.OsuApi.Configurations;
using CircleForms.Hangfire;
using CircleForms.IO.FileIO;
using CircleForms.IO.FileIO.Abstract;
using CircleForms.IO.FileIO.Configuration;
using FastExpressionCompiler;
using FluentValidation.AspNetCore;
using Hangfire;
using Hangfire.Redis;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using MongoDB.Entities;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using StackExchange.Redis;
using Swashbuckle.AspNetCore.Filters;

namespace CircleForms;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        var config = Configuration.GetSection("osuApi");
        services.Configure<OsuApiConfig>(config);
        services.Configure<SuperAdminsId>(Configuration.GetSection("SuperAdmins"));
        services.Configure<StaticFilesConfig>(Configuration.GetSection("StaticFiles"));

        services.AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>());

        TypeAdapterConfig.GlobalSettings.Scan(Assembly.GetEntryAssembly()!);
        TypeAdapterConfig.GlobalSettings.Compiler = x => x.CompileFast();
        services.AddTransient<IMapper, Mapper>();

        services.AddAuthentication("InternalCookies")
            .AddCookie("InternalCookies", options =>
            {
                // set some paths to empty to make auth not redirect API calls
                options.LoginPath = string.Empty;
                options.AccessDeniedPath = string.Empty;
                options.LogoutPath = string.Empty;
                options.Cookie.Path = "/";
                options.SlidingExpiration = true;
                options.Events.OnValidatePrincipal = context =>
                {
                    var name = context.Principal?.Identity?.Name;
                    if (string.IsNullOrEmpty(name) || !long.TryParse(name, out _))
                    {
                        context.RejectPrincipal();
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    }

                    return Task.CompletedTask;
                };

                static Task UnauthorizedRedirect(RedirectContext<CookieAuthenticationOptions> context)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;

                    return Task.CompletedTask;
                }

                options.Events.OnRedirectToLogin = UnauthorizedRedirect;
                options.Events.OnRedirectToAccessDenied = UnauthorizedRedirect;
            })
            .AddCookie("ExternalCookies")
            .AddOAuth("osu", options =>
            {
                options.SignInScheme = "ExternalCookies";

                options.TokenEndpoint = "https://osu.ppy.sh/oauth/token";
                options.AuthorizationEndpoint = "https://osu.ppy.sh/oauth/authorize";
                options.ClientId = config["ClientID"];
                options.ClientSecret = config["ClientSecret"];
                options.CallbackPath = config["CallbackUrl"];
                options.Scope.Add("public");

                options.SaveTokens = true;

                options.Validate();
            });

        services.AddSingleton<IOsuApiProvider, OsuApiProvider>();
        services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<IPostRepository, PostRepository>();
        services.AddTransient<IAnswerService, AnswerService>();
        services.AddTransient<IPublishService, PublishService>();
        services.AddTransient<IGamemodeService, GamemodeService>();
        services.AddTransient<IAnswerRepository, AnswerRepository>();
        services.AddTransient<PostsService>();
        services.AddTransient<ICacheRepository, RedisCacheRepository>();
        services.AddTransient<IStaticFilesService, StaticFilesService>();
        services.AddTransient<IActivityJob, ActivityJob>();

        DB.InitAsync("circleforms",
            MongoClientSettings.FromConnectionString(Configuration.GetConnectionString("Database"))).Wait();

        var multiplexer = ConnectionMultiplexer.Connect(Configuration.GetConnectionString("Redis"));
        services.AddSingleton<IConnectionMultiplexer>(multiplexer);

        services.AddHangfire(x =>
        {
            x.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseRedisStorage(multiplexer, new RedisStorageOptions
                {
                    Prefix = "hangfire_job:"
                });
        });

        services.AddHangfireServer(options =>
        {
            options.SchedulePollingInterval = TimeSpan.FromMinutes(1);
        });

        services.AddControllers()
            .AddNewtonsoftJson(opts =>
            {
                opts.SerializerSettings.Converters.Add(new StringEnumConverter());
                opts.SerializerSettings.Formatting = Formatting.None;
                opts.SerializerSettings.ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new SnakeCaseNamingStrategy
                    {
                        ProcessDictionaryKeys = true,
                        ProcessExtensionDataNames = true
                    }
                };
            });

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "CircleForms", Version = "v1" });
            c.EnableAnnotations();

            var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

            c.OperationFilter<AppendAuthorizeToSummaryOperationFilter>();
            c.OperationFilter<SecurityRequirementsOperationFilter>();

            c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
            {
                Description =
                    "Main authorization cookie. Get by going to .../OAuth/auth and completing authorization using you osu! account.",
                In = ParameterLocation.Cookie,
                Name = ".AspNetCore.InternalCookies",
                Type = SecuritySchemeType.ApiKey
            });
        });
        services.AddSwaggerGenNewtonsoftSupport();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseForwardedHeaders(new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.All });

        var basePath = Configuration.GetValue<string>("PathBase");

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseCookiePolicy(new CookiePolicyOptions
            {
                Secure = CookieSecurePolicy.None,
                MinimumSameSitePolicy = SameSiteMode.Lax
            });

            app.UseCors(x =>
            {
                x.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
            });
        }

        if (env.IsDevelopment() || env.IsStaging())
        {
            app.UseSwagger(c =>
            {
                c.RouteTemplate = "swagger/{documentName}/swagger.json";
                c.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
                {
                    var scheme = env.IsStaging() ? "https" : httpReq.Scheme;
                    swaggerDoc.Servers = new List<OpenApiServer>
                        { new() { Url = $"{scheme}://{httpReq.Host.Value}{basePath}" } };
                });
            });
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CircleForms v1"));
        }

        if (env.IsStaging() || env.IsProduction())
        {
            app.Use((context, next) =>
            {
                context.Request.Scheme = "https";

                return next(context);
            });

            app.UseCookiePolicy(new CookiePolicyOptions
            {
                Secure = CookieSecurePolicy.SameAsRequest,
                MinimumSameSitePolicy = SameSiteMode.Lax
            });
        }

        // WARNING: These MUST be after cookie configuration, otherwise production breaks in a very bizarre and non-descriptive way.
        //          This was a big headache to find and fix, so if you need to change the order first make sure it will work in prod.
        app.UsePathBase(basePath);
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        if (env.IsDevelopment())
        {
            app.UseHangfireDashboard(options: new DashboardOptions
            {
                AppPath = "https://localhost:5001/swagger"
            });
        }
        else
        {
            app.UseHangfireDashboard(options: new DashboardOptions
            {
                IsReadOnlyFunc = _ => true,
                Authorization = new[] { new AuthorizationFilter() }
            });
        }

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHangfireDashboard();
        });
    }
}
