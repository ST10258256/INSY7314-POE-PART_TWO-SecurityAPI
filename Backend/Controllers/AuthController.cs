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
        if (!Regex.IsMatch(dto.Email, @"^\S+@\S+\.\S+$"))
            return BadRequest("Invalid email format");

        if (await _userRepo.GetByEmailAsync(dto.Email) != null)
            return BadRequest("Email already exists");

        PasswordHelper.CreatePasswordHash(dto.Password, out byte[] hash, out byte[] salt);


        var user = new User
        {
            Email = dto.Email,
            PasswordHash = hash,
            PasswordSalt = salt
        };

        await _userRepo.CreateAsync(user);
        return Ok("User registered");
}

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null || !PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash, user.PasswordSalt))
            return Unauthorized("Invalid credentials");

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
        new Claim(ClaimTypes.Role, user.Role)
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

