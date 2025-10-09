using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using MongoDB.Driver;
using Backend.Repositories;
using System.Text.RegularExpressions;



[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserRepository _userRepo;
    private readonly IConfiguration _config;

    public AuthController(UserRepository userRepo, IConfiguration config)
    {
        _userRepo = userRepo;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // Automatic DTO validation happens here due to [ApiController]
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                                   .SelectMany(v => v.Errors)
                                   .Select(e => e.ErrorMessage)
                                   .ToList();
            return BadRequest(new { Errors = errors });
        }

        // Business rule: email uniqueness
        if (await _userRepo.GetByEmailAsync(dto.Email) != null)
            return BadRequest(new { Errors = new[] { "Email already exists" } });

        // Business rule: account number uniqueness
        if (await _userRepo.GetByAccountNumberAsync(dto.AccountNumber) != null)
            return BadRequest(new { Errors = new[] { "Account Number already exists" } });

        // Business rule: password complexity
        var passwordErrors = new List<string>();
        if (dto.Password.Length < 8)
            passwordErrors.Add("Password must be at least 8 characters long");
        if (!Regex.IsMatch(dto.Password, @"[A-Z]"))
            passwordErrors.Add("Password must contain at least one uppercase letter");
        if (!Regex.IsMatch(dto.Password, @"[a-z]"))
            passwordErrors.Add("Password must contain at least one lowercase letter");
        if (!Regex.IsMatch(dto.Password, @"[0-9]"))
            passwordErrors.Add("Password must contain at least one digit");
        if (!Regex.IsMatch(dto.Password, @"[@$!%*?&]"))
            passwordErrors.Add("Password must contain at least one special character (@$!%*?&)");
        if (passwordErrors.Any())
            return BadRequest(new { Errors = passwordErrors });

        // Create password hash
        PasswordHelper.CreatePasswordHash(dto.Password, out byte[] hash, out byte[] salt);

        // Create user object
        var user = new User
        {
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Username = dto.Username,
            IdNumber = dto.IdNumber,
            AccountNumber = dto.AccountNumber,
            PasswordHash = hash,
            PasswordSalt = salt,
        };

        await _userRepo.CreateAsync(user);
        return Ok("User registered successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        // Automatic DTO validation happens here
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                                   .SelectMany(v => v.Errors)
                                   .Select(e => e.ErrorMessage)
                                   .ToList();
            return BadRequest(new { Errors = errors });
        }

        var user = await _userRepo.GetByAccountNumberAsync(dto.AccountNumber);
        if (user == null || !PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash, user.PasswordSalt))
            return Unauthorized(new { Errors = new[] { "Invalid credentials" } });

        var token = GenerateJwtToken(user);
        return Ok(new { Token = token });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")!;
        var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
        var key = new SymmetricSecurityKey(keyBytes);
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id!),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("account_number", user.AccountNumber)
        };

        var token = new JwtSecurityToken(
            issuer: Environment.GetEnvironmentVariable("JWT_ISSUER"),
            audience: Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIREMINUTES") ?? "60")),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
