using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

const string SecretData = "SecretData";
const string OpenData = "OpenData";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options=> {
    options.AddDefaultPolicy(policy => {
        policy.WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(options => {
        builder.Configuration.Bind("AzureAd", options);
        options.TokenValidationParameters.NameClaimType="name";
    }, options=> {builder.Configuration.Bind("AzureAd",options );});

    builder.Services.AddAuthorization( config => {
        config.AddPolicy(SecretData, policyBuilder => {
            policyBuilder.Requirements.Add(new ScopeAuthorizationRequirement(){RequiredScopesConfigurationKey="AzureAd:Scopes"});
            policyBuilder.RequireRole("secret.reader");
        });
        config.AddPolicy(OpenData, policyBuilder => {
            policyBuilder.Requirements.Add(new ScopeAuthorizationRequirement(){RequiredScopesConfigurationKey="AzureAd:Scopes"});
        });
    });

var app = builder.Build();

app.UseCors();

app.MapGet("/open", ()=> new {data="# This is public data. # 😊"})
    .RequireAuthorization(OpenData);

app.MapGet("/protected", () => new {data="# This is a secret. # 🤐"})
     .RequireAuthorization(SecretData);

app.Run();
