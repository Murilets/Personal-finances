using FinChat.Application.Dtos.Dashboard;

namespace FinChat.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync(int? year, int? month, CancellationToken ct = default);
    Task<CategoryBreakdownResponse> GetByCategoryAsync(int? year, int? month, CancellationToken ct = default);
    Task<List<MonthOptionResponse>> GetAvailableMonthsAsync(CancellationToken ct = default);
}
