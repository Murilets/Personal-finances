using FinChat.Application.Dtos.Expenses;
using FinChat.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinChat.Api.Controllers;

[ApiController]
[Route("api/expenses")]
public class ExpenseController : ControllerBase
{
    private readonly IExpenseService _expenseService;

    public ExpenseController(IExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ExpenseResponse>>> GetAll(CancellationToken ct)
        => Ok(await _expenseService.GetAllAsync(ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExpenseResponse>> GetById(Guid id, CancellationToken ct)
        => Ok(await _expenseService.GetByIdAsync(id, ct));

    [HttpGet("category/{categoryId:guid}")]
    public async Task<ActionResult<List<ExpenseResponse>>> GetByCategoryId(Guid categoryId, CancellationToken ct)
        => Ok(await _expenseService.GetByCategoryIdAsync(categoryId, ct));

    [HttpPost]
    public async Task<ActionResult<ExpenseResponse>> Create(CreateExpenseRequest request, CancellationToken ct)
    {
        var expense = await _expenseService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateExpenseRequest request, CancellationToken ct)
    {
        await _expenseService.UpdateAsync(id, request, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _expenseService.DeleteAsync(id, ct);
        return NoContent();
    }
}