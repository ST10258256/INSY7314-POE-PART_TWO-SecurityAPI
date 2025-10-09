using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        // Validate DTO
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                                   .SelectMany(v => v.Errors)
                                   .Select(e => e.ErrorMessage)
                                   .ToList();
            return BadRequest(new { Errors = errors });
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var payment = new Payment
        {
            UserId = userId!,
            Amount = dto.Amount,
            Currency = dto.Currency,
            SWIFTCode = dto.SWIFTCode,
            AccountNumber = dto.AccountNumber
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
