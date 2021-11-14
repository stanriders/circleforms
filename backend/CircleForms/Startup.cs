using System;
using System.Text;
using System.Threading.Tasks;
using CircleForms.Models.Configurations;
using CircleForms.Services;
using CircleForms.Services.Database;
using CircleForms.Services.Database.Interfaces;
using CircleForms.Services.Interfaces;
using CircleForms.Services.Request;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RestSharp;
using StackExchange.Redis;

namespace CircleForms
{
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
            services.Configure<JwtConfig>(Configuration.GetSection("jwtConfig"));

            var secret = Encoding.ASCII.GetBytes(Configuration["jwtConfig:Secret"]);
            services.AddAuthentication(x =>
                {
                    x.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddCookie()
                .AddJwtBearer(x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(secret),
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidIssuer = Configuration["jwtConfig:Issuer"],
                        ValidAudience = Configuration["jwtConfig:Audience"],
                        ClockSkew = TimeSpan.Zero
                    };
                    x.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            context.Token = context.Request.Cookies["CRINGEC"];

                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddTransient<IRestClient, RestClient>();
            services.AddTransient<IOsuApiService, OsuApiService>();
            services.AddTransient<ITokenService, TokenService>();
            services.AddTransient<IOsuUserProvider, OsuUserProvider>();
            services.AddTransient<IUserDatabaseService, UserDatabaseService>();

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
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CircleForms v1"));
            }

            app.UseSession();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();
            app.UseAuthentication();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}
