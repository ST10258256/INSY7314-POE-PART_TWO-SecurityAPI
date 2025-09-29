using Backend.Repositories;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// Load .env file
Env.Load();

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();
