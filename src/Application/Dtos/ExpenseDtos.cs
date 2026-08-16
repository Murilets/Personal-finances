namespace FinChat.Application.Dtos.Expenses;

using FinChat.Application.Dtos.Categories;

public record ExpenseResponse(Guid Id, decimal Amount, DateTime Date, Guid CategoryId, string? Note, CategoryResponse Category);
public record CreateExpenseRequest(decimal Amount, DateTime Date, Guid CategoryId, string? Note);
public record UpdateExpenseRequest(decimal Amount, DateTime Date, Guid CategoryId, string? Note);