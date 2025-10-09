using Backend.Repositories;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Cryptography.X509Certificates;
using System.Text;

// Load .env file
Env.Load();
Console.WriteLine(Environment.GetEnvironmentVariable("JWT_KEY"));

var builder = WebApplication.CreateBuilder(args);

// Load SSL certificate
var certPath = Path.Combine(builder.Environment.ContentRootPath, "cert.pem");
var keyPath = Path.Combine(builder.Environment.ContentRootPath, "key.pem");
var certificate = X509Certificate2.CreateFromPemFile(certPath, keyPath);
certificate = new X509Certificate2(certificate.Export(X509ContentType.Pfx));

// Configure Kestrel with HTTPS using the certificate
builder.WebHost.ConfigureKestrel(options =>
{
    // Listen on HTTP
    options.ListenLocalhost(5162);

    // Listen on HTTPS
    options.ListenLocalhost(7068, listenOptions =>
    {
        listenOptions.UseHttps(certificate);
    });
});

// Read env variables
var mongoConnection = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING");
var mongoDbName = Environment.GetEnvironmentVariable("MONGO_DATABASE_NAME");

// Register MongoDB context
builder.Services.AddSingleton<IMongoDbContext>(sp =>
    new MongoDbContext(mongoConnection!, mongoDbName!)
);

builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<PaymentRepository>();

// JWT config
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")!;
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
var key = new SymmetricSecurityKey(keyBytes);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER"),
        ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
        IssuerSigningKey = key
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Banking API", Version = "v1" });

    // JWT Authorization in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactLocal", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:5174",
            "https://securityapi-x4rg.onrender.com"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

// Apply CORS
app.UseCors("AllowReactLocal");

// Enforce HTTPS in non-development
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();  // Strict HTTPS headers
}

// Redirect all HTTP to HTTPS
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Banking API V1");
    c.RoutePrefix = string.Empty;
});

app.Run();
