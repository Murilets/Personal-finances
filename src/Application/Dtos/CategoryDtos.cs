namespace FinChat.Application.Dtos.Categories;

public record CategoryResponse(Guid Id, string Name, string? Description);
public record CreateCategoryRequest(string Name, string? Description);
public record UpdateCategoryRequest(string Name, string? Description);