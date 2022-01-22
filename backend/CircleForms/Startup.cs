using System;
using System.Collections.Generic;
using CircleForms.Models.Configurations;
using CircleForms.Services;
using CircleForms.Services.Database;
using CircleForms.Services.Database.Interfaces;
using CircleForms.Services.Interfaces;
using CircleForms.Services.Request;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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
        services.Configure<OsuApiConfig>(Configuration.GetSection("osuApi"));

        services.AddTransient<IRestClient, RestClient>();
        services.AddTransient<ITokenService, TokenService>();
        services.AddTransient<IOsuUserProvider, OsuUserProvider>();
        services.AddTransient<IUserRepository, UserRepository>();

        services.AddDistributedMemoryCache();
        services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromDays(10);
            options.Cookie.Name = ".CRINGE";
        });

        services.AddSingleton<ISessionService, SessionService>();
        var multiplexer = ConnectionMultiplexer.Connect(Configuration.GetConnectionString("Redis"));
        services.AddSingleton<IConnectionMultiplexer>(multiplexer);
        services.AddControllers();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo {Title = "CircleForms", Version = "v1"});
        });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
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
        }

        app.UseSession();

        app.UseForwardedHeaders(new ForwardedHeadersOptions {ForwardedHeaders = ForwardedHeaders.All});
        app.UsePathBase(basePath);

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
    }
}
