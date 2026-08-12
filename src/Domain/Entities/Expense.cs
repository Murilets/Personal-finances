namespace FinChat.Domain.Entities;
using FinChat.Domain.Exceptions;

public class Expense
{
    public Guid Id { get; private set; }
    public decimal Amount { get; private set; }
    public DateTime Date { get; private set; }
    public Guid CategoryId { get; private set; }
    public string? Note { get; private set; }

    private Expense()
    {
    }

    public static Expense Create(decimal amount, DateTime date, Guid categoryId, string? note = null)
    {
        if (amount <= 0)
            throw new DomainException("Amount must be greater than zero");

        return new Expense()
        {
            Id = Guid.NewGuid(),
            Amount = amount,
            Date = date,
            CategoryId = categoryId,
            Note = note
        };
    }

    public void UpdateAmount(decimal newAmount)
    {
        if (newAmount <= 0)
            throw new DomainException("Amount must be greater than zero");

        Amount = newAmount;
    }
}