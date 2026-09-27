namespace FinChat.Domain.ReadModel;

public record MonthlyTotal
(
    int Year,
    int Month,
    decimal Total
);
