namespace FinChat.Infrastructure.Persistence.Repositories;

using FinChat.Domain.Entities;
using FinChat.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

public class ExpenseRepository : IExpenseRepository
{
    private readonly AppDbContext _context;

    public ExpenseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Expense?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Expenses
            .Include(e => e.Category)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<List<Expense>> GetAllAsync(
    DateTime?  startDate = null,
    DateTime? endDate = null,
    Guid? categoryId = null,
    CancellationToken cancellationToken = default)
    {
        var query = _context.Expenses
        .Include(e => e.Category)
        .AsNoTracking();

        //dynamic filters
        if(startDate.HasValue) 
            query = query.Where(e => e.Date >= startDate.Value);
        if(endDate.HasValue)
        query = query.Where(e => e.Date <= endDate.Value);
        if(categoryId.HasValue)
        query = query.Where(e => e.CategoryId == categoryId.Value);    

        return await query
        .OrderByDescending(e => e.Date)
        .ToListAsync(cancellationToken);
    }

    public async Task<List<Expense>> GetByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken = default)
    {
        return await _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.CategoryId == categoryId)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Expense expense, CancellationToken cancellationToken = default)
    {
        await _context.Expenses.AddAsync(expense, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Expense expense, CancellationToken cancellationToken = default)
    {
        _context.Expenses.Update(expense);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Expense expense, CancellationToken cancellationToken = default)
    {
        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
