using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[Route("api/admin/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminPaymentsController : ControllerBase
{
    private readonly PaymentRepository _paymentRepo;

    public AdminPaymentsController(PaymentRepository paymentRepo)
    {
        _paymentRepo = paymentRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPayments()
    {
        var payments = await _paymentRepo.GetAllAsync();
        return Ok(payments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPayment(string id)
    {
        var payment = await _paymentRepo.GetByIdAsync(id);
        if (payment == null) return NotFound();
        return Ok(payment);
    }

    [HttpPatch("{id}/verify")]
    public async Task<IActionResult> VerifyPayment(string id)
    {
        await _paymentRepo.UpdateStatusAsync(id, "Verified");
        return Ok("Payment verified");
    }

    [HttpPatch("{id}/process")]
    public async Task<IActionResult> ProcessPayment(string id)
    {
        await _paymentRepo.UpdateStatusAsync(id, "Processed");
        return Ok("Payment processed");
    }
}

