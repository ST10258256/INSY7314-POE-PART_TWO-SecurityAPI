using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using System.Text.RegularExpressions;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class PaymentsController : ControllerBase
{
    private readonly PaymentRepository _paymentRepo;

    public PaymentsController(PaymentRepository paymentRepo)
    {
        _paymentRepo = paymentRepo;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePayment([FromBody] PaymentDto dto)
    {
        if (!Regex.IsMatch(dto.SWIFTCode, @"^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$"))
            return BadRequest("Invalid SWIFT code");

        if (dto.Amount <= 0)
            return BadRequest("Invalid amount");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var payment = new Payment
        {
            UserId = userId!,
            Amount = dto.Amount,
            Currency = dto.Currency,
            SWIFTCode = dto.SWIFTCode
        };

        await _paymentRepo.CreateAsync(payment);
        return Ok(payment);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyPayments()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var payments = await _paymentRepo.GetByUserIdAsync(userId!);
        return Ok(payments);
    }
}
