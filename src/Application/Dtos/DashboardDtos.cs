namespace FinChat.Application.Dtos.Dashboard;

public record DashboardSummaryResponse(int Year, int Month, decimal MonthTotal, decimal OverallTotal,
int CategoryCount, TopCategoryResponse? TopCategory);

public record TopCategoryResponse(Guid CategoryId, string CategoryName, decimal Amount);

public record CategoryBreakdownResponse(int? Year, int? Month, decimal Total, List<CategorySpendingResponse> Items);

public record CategorySpendingResponse(Guid CategoryId, string Name, decimal Amount, decimal Percentage);

public record MonthOptionResponse(int Year, int Month);