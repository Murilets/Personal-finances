namespace FinChat.Application.Interfaces;

using FinChat.Application.Dtos.Expenses;

public interface IExpenseService
{
    Task<List<ExpenseResponse>> GetAllAsync(CancellationToken ct = default);
    Task<ExpenseResponse> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<ExpenseResponse>> GetByCategoryIdAsync(Guid categoryId, CancellationToken ct = default);
    Task<ExpenseResponse> CreateAsync(CreateExpenseRequest request, CancellationToken ct = default);
    Task<ExpenseResponse> UpdateAsync(Guid id, UpdateExpenseRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}