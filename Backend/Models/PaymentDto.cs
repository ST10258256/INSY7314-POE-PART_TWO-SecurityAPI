using System.ComponentModel.DataAnnotations;

public class PaymentDto
{
    [Required]
    [Range(0.01, 1000000, ErrorMessage = "Amount must be between 0.01 and 1,000,000")]
    public decimal Amount { get; set; }

    [Required]
    [RegularExpression(@"^[A-Z]{1,3}$", ErrorMessage = "Currency must be a valid code (e.g., ZAR, USD, EUR)")]
    public string Currency { get; set; } = "ZAR";

    [Required]
    [RegularExpression(@"^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$", ErrorMessage = "Invalid SWIFT code format")]
    public string SWIFTCode { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[0-9]{5,15}$", ErrorMessage = "Account number must be 5–15 digits")]
    public string AccountNumber { get; set; } = string.Empty;
}
