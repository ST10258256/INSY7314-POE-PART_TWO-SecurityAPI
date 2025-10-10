using System.ComponentModel.DataAnnotations;

public class RegisterDto
{
    [Required]
    [RegularExpression(@"^[A-Za-z\s'-]{2,50}$", ErrorMessage = "Invalid first name")]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[A-Za-z\s'-]{2,50}$", ErrorMessage = "Invalid last name")]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[a-zA-Z0-9_]{3,20}$", ErrorMessage = "Username must be 3–20 characters, letters/numbers/underscores only")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[0-9]{6,13}$", ErrorMessage = "ID number must be 6–13 digits")]
    public string IdNumber { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[0-9]{5,15}$", ErrorMessage = "Account number must be 5–15 digits")]
    public string AccountNumber { get; set; } = string.Empty;

    [Required]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[A-Za-z\d@$!%*?&]{8,}$", ErrorMessage = "Password must be at least 8 characters and may contain safe symbols")]
    public string Password { get; set; } = string.Empty;
}
