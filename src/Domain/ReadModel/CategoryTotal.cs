namespace FinChat.Domain.ReadModel;

public record CategoryTotal
(
    Guid CategoryId, 
    string CategoryName, 
    decimal Total
);
