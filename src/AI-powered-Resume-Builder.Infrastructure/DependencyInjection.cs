using AI_powered_Resume_Builder.Application.Services;
using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using AI_powered_Resume_Builder.Domain.Resumes;
using AI_powered_Resume_Builder.Domain.Users;
using AI_powered_Resume_Builder.Infrastructure.AI;
using AI_powered_Resume_Builder.Infrastructure.Data.Context;
using AI_powered_Resume_Builder.Infrastructure.Data.Repositories;
using AI_powered_Resume_Builder.Infrastructure.JWT;
using AI_powered_Resume_Builder.Infrastructure.Resumes;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AI_powered_Resume_Builder.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("PostgreSQL"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        // Identity
        services
            .AddIdentity<ApplicationUser, IdentityRole<Guid>>(opt =>
            {
                opt.Password.RequiredLength = 1;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireDigit = false;
                opt.Password.RequireLowercase = false;
                opt.Password.RequireUppercase = false;
                opt.Lockout.MaxFailedAccessAttempts = 5;
                opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                opt.SignIn.RequireConfirmedEmail = false;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        // Repositories
        services.AddScoped<IResumeRepository, ResumeRepository>();
        services.AddScoped<IAiFeedbackRepository, AiFeedbackRepository>();

        // JWT Services
        services.Configure<JwtOptions>(configuration.GetSection("JWT"));
        services.ConfigureOptions<JwtOptionsSetup>();
        services.AddScoped<IJwtService, JwtService>();

        // AI Services
        var geminiSettings = configuration.GetSection("GeminiSettings").Get<GeminiSettings>();

        services.AddHttpClient<IAiService, GeminiService>(client =>
        {
            client.BaseAddress = new Uri("https://generativelanguage.googleapis.com");
        })
        .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler());
        services.AddHttpClient<IAiService, GeminiService>();
        if (geminiSettings != null)
        {
            services.AddSingleton(geminiSettings);
        }
        // Resume services
        var systemInstructions = configuration.GetSection("GeminiSettings:SystemInstructions").Get<SystemInstructions>();
        if (systemInstructions != null)
        {
            services.AddSingleton(systemInstructions);
        }
        services.AddHttpContextAccessor();

        services.AddScoped<IResumeGenerationService, ResumeGenerationService>();
        services.AddScoped<IResumeAnalysisService, ResumeAnalysisService>();

        // CurrentUserService  
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        return services;

    }
}
