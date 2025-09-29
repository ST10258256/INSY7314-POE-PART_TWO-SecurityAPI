public class PaymentDto
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "R";
    public string SWIFTCode { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
}
