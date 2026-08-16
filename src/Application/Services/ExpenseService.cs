using FinChat.Application.Dtos.Categories;
using FinChat.Application.Dtos.Expenses;
using FinChat.Application.Interfaces;
using FinChat.Domain.Entities;
using FinChat.Domain.Exceptions;
using FinChat.Domain.Interfaces;

namespace FinChat.Application.Services;

public class ExpenseService : IExpenseService
{
    private readonly IExpenseRepository _expenseRepository;
    private readonly ICategoryRepository _categoryRepository;

    public ExpenseService(IExpenseRepository expenseRepository, ICategoryRepository categoryRepository)
    {
        _expenseRepository = expenseRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<List<ExpenseResponse>> GetAllAsync(CancellationToken ct = default)
    {
        var expenses = await _expenseRepository.GetAllAsync(ct);
        return expenses.Select(MapToResponse).ToList();
    }

    public async Task<ExpenseResponse> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var expense = await _expenseRepository.GetByIdAsync(id, ct)
            ?? throw new DomainException($"Despesa {id} nao encontrada");

        return MapToResponse(expense);
    }

    public async Task<List<ExpenseResponse>> GetByCategoryIdAsync(Guid categoryId, CancellationToken ct = default)
    {
        var expenses = await _expenseRepository.GetByCategoryIdAsync(categoryId, ct);
        return expenses.Select(MapToResponse).ToList();
    }

    public async Task<ExpenseResponse> CreateAsync(CreateExpenseRequest request, CancellationToken ct = default)
    {
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId, ct)
            ?? throw new DomainException($"A categoria {request.CategoryId} nao existe");

        var expense = Expense.Create(request.Amount, request.Date, request.CategoryId, request.Note);
        await _expenseRepository.AddAsync(expense, ct);

        return new ExpenseResponse(expense.Id, expense.Amount, expense.Date, expense.CategoryId, expense.Note,
            MapCategory(category));
    }

    public async Task<ExpenseResponse> UpdateAsync(Guid id, UpdateExpenseRequest request, CancellationToken ct = default)
    {
        var expense = await _expenseRepository.GetByIdAsync(id, ct)
            ?? throw new DomainException($"Despesa {id} nao encontrada");

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId, ct)
            ?? throw new DomainException($"A categoria {request.CategoryId} nao existe");

        expense.Update(request.Amount, request.Date, request.CategoryId, request.Note);
        await _expenseRepository.UpdateAsync(expense, ct);

        return new ExpenseResponse(expense.Id, expense.Amount, expense.Date, expense.CategoryId, expense.Note,
            MapCategory(category));
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var expense = await _expenseRepository.GetByIdAsync(id, ct)
            ?? throw new DomainException($"Despesa {id} nao encontrada");

        await _expenseRepository.DeleteAsync(expense, ct);
    }

    private static ExpenseResponse MapToResponse(Expense expense)
        => new(expense.Id, expense.Amount, expense.Date, expense.CategoryId, expense.Note,
            MapCategory(expense.Category));

    private static CategoryResponse MapCategory(Category category)
        => new(category.Id, category.Name, category.Description);
}