using System;
using Microsoft.Extensions.Configuration;

namespace AI_powered_Resume_Builder.Infrastructure.Data;

static class Configuration
    {
        static public string ConnectionString
        {
            get
            {
                ConfigurationManager configurationManager = new();
                configurationManager.SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../AI-powered-Resume-Builder.WebApi"));
                configurationManager.AddJsonFile("appsettings.Development.json");

                return configurationManager.GetConnectionString("PostgreSQL");
            }
        }
    }