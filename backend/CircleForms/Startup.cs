using System.Collections.Generic;
using System.Threading.Tasks;
using CircleForms.Models.Configurations;
using CircleForms.Services.Database;
using CircleForms.Services.Database.Interfaces;
using CircleForms.Services.Interfaces;
using CircleForms.Services.Request;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using RestSharp;
using StackExchange.Redis;

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

        services.AddAuthentication("InternalCookies")
            .AddCookie("InternalCookies", options =>
            {
                // set some paths to empty to make auth not redirect API calls
                options.LoginPath = string.Empty;
                options.AccessDeniedPath = string.Empty;
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
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

        services.AddTransient<IRestClient, RestClient>();
        services.AddTransient<IOsuUserProvider, OsuUserProvider>();
        services.AddTransient<IUserRepository, UserRepository>();

        services.AddDistributedMemoryCache();

        var multiplexer = ConnectionMultiplexer.Connect(Configuration.GetConnectionString("Redis"));
        services.AddSingleton<IConnectionMultiplexer>(multiplexer);

        services.AddControllers();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "CircleForms", Version = "v1" });
        });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseForwardedHeaders(new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.All });

        var basePath = Configuration.GetValue<string>("PathBase");
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger(c =>
            {
                c.RouteTemplate = "swagger/{documentName}/swagger.json";
                c.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
                {
                    swaggerDoc.Servers = new List<OpenApiServer>
                        {new() {Url = $"{httpReq.Scheme}://{httpReq.Host.Value}{basePath}"}};
                });
            });
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CircleForms v1"));

            app.UseCookiePolicy(new CookiePolicyOptions
            {
                Secure = CookieSecurePolicy.None,
                MinimumSameSitePolicy = SameSiteMode.None
            });
        }
        else
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

        app.UsePathBase(basePath);

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
    }
}
