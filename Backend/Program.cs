using Backend.Repositories;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using System.Text;
using Microsoft.AspNetCore.Http;
using NWebsec.AspNetCore.Middleware;
using Backend.Middleware;

// Load .env file
Env.Load();
Console.WriteLine("JWT_KEY: " + Environment.GetEnvironmentVariable("JWT_KEY"));
Console.WriteLine("MongoDB: " + Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING"));

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRateLimiter(options =>
{
    // login only allows 5 requests every 5 minutes
    options.AddFixedWindowLimiter("login", o =>
    {
        o.PermitLimit = 5;
        o.Window = TimeSpan.FromMinutes(5);
        o.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        o.QueueLimit = 0;
    });

    // register only allows 3 requests every 10 minutes
    options.AddFixedWindowLimiter("register", o =>
    {
        o.PermitLimit = 3;
        o.Window = TimeSpan.FromMinutes(10);
        o.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        o.QueueLimit = 0;
    });

    // custom rejection response
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsync("{\"message\":\"Too many requests. Please try again later.\"}", token);
    };
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

    // Add JWT Authorization to Swagger
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
            "http://localhost:5173",  //For the local react development server
            "http://localhost:5174",
             "https://securityapi-x4rg.onrender.com" //For the deployed react app on render.com
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCsp(options => options
    .DefaultSources(s => s.Self())
    .ScriptSources(s => s.Self())
    .StyleSources(s => s.Self())
);


app.UseRateLimiter();

app.UseCors("AllowReactLocal");
app.UseSecurityHeaders();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

//Remove this code when we are finished, this is only being used when to test if the hosting of the api works
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Banking API V1");
    c.RoutePrefix = string.Empty;
});

app.Run();
