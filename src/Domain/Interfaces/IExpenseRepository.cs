namespace FinChat.Domain.Interfaces;

using FinChat.Domain.Entities;

public interface IExpenseRepository
{
    Task<Expense?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Expense>> GetAllAsync(DateTime?  startDate = null, DateTime? endDate = null,Guid? categoryId = null, CancellationToken cancellationToken = default);
    Task<List<Expense>> GetByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken = default);
    Task AddAsync(Expense expense, CancellationToken cancellationToken = default);
    Task UpdateAsync(Expense expense, CancellationToken cancellationToken = default);
    Task DeleteAsync(Expense expense, CancellationToken cancellationToken = default);
}
