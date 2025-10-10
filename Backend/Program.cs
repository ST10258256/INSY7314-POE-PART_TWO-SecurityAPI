using Backend.Repositories;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Cryptography.X509Certificates;
using System.Text;

// Load .env file for local development
Env.Load();
Console.WriteLine(Environment.GetEnvironmentVariable("JWT_KEY"));

var builder = WebApplication.CreateBuilder(args);

// Load SSL Certificate 
X509Certificate2? certificate = null;

// Check for Render environment variables
var certB64 = Environment.GetEnvironmentVariable("CERT_PEM");
var keyB64 = Environment.GetEnvironmentVariable("KEY_PEM");

if (!string.IsNullOrEmpty(certB64) && !string.IsNullOrEmpty(keyB64))
{
    // Decode Base64 and create certificate
    var certPem = Encoding.UTF8.GetString(Convert.FromBase64String(certB64));
    var keyPem = Encoding.UTF8.GetString(Convert.FromBase64String(keyB64));

    certificate = X509Certificate2.CreateFromPem(certPem, keyPem);
    certificate = new X509Certificate2(certificate.Export(X509ContentType.Pfx));
}
else if (File.Exists("cert.pem") && File.Exists("key.pem"))
{
    // Local development
    certificate = X509Certificate2.CreateFromPemFile("cert.pem", "key.pem");
    certificate = new X509Certificate2(certificate.Export(X509ContentType.Pfx));
}
else
{
    Console.WriteLine("No SSL certificate found. HTTPS will not work.");
}

// Configure Kestrel 
var renderPort = Environment.GetEnvironmentVariable("PORT") ?? "5162";
int.TryParse(renderPort, out var portToUse);
if (portToUse == 0) portToUse = 5162;

builder.WebHost.ConfigureKestrel(options =>
{
    if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PORT")))
    {
        // Local dev: use HTTPS
        options.ListenAnyIP(portToUse, listenOptions =>
        {
            if (certificate != null)
                listenOptions.UseHttps(certificate);
        });
    }
    else
    {
        // Render: use HTTP only on the port they assign
        options.ListenAnyIP(portToUse); // plain HTTP
    }
});








//  MongoDB & Repositories 
var mongoConnection = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING");
var mongoDbName = Environment.GetEnvironmentVariable("MONGO_DATABASE_NAME");

builder.Services.AddSingleton<IMongoDbContext>(sp =>
    new MongoDbContext(mongoConnection!, mongoDbName!)
);

builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<PaymentRepository>();

// ---------- JWT ----------
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

//Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Banking API", Version = "v1" });
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

// CORS 
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
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Middleware 
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactLocal");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Banking API V1");
    c.RoutePrefix = string.Empty;
});

app.Run();
