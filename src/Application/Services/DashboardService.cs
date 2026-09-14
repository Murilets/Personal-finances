namespace FinChat.Application.Services;

using FinChat.Application.Dtos.Dashboard;
using FinChat.Application.Interfaces;
using FinChat.Domain.Exceptions;
using FinChat.Domain.Interfaces;
using FinChat.Domain.ValueObjects;

public class DashboardService : IDashboardService
{
    private readonly IExpenseRepository _expenseRepository;
    private readonly TimeProvider _timeProvider;

    public DashboardService(IExpenseRepository expenseRepository, TimeProvider timeProvider)
    {
        _expenseRepository = expenseRepository;
        _timeProvider = timeProvider;
    }

    public async Task<DashboardSummaryResponse> GetSummaryAsync(int? year, int? month, CancellationToken ct = default)
    {
        var period = ResolvePeriod(year, month) ?? CurrentMonth();

        var monthTotals = await _expenseRepository.GetTotalsByCategoryAsync(period.StartUtc, period.EndUtc, ct);
        var overallTotals = await _expenseRepository.GetTotalsByCategoryAsync(cancellationToken: ct);

        var top = monthTotals
            .Where(t => t.Total > 0)
            .OrderByDescending(t => t.Total)
            .ThenBy(t => t.CategoryName)
            .FirstOrDefault();

        return new DashboardSummaryResponse(
            period.Year,
            period.Month,
            monthTotals.Sum(t => t.Total),
            overallTotals.Sum(t => t.Total),
            overallTotals.Count,
            top is null ? null : new TopCategoryResponse(top.CategoryId, top.CategoryName, top.Total));
    }

    public async Task<CategoryBreakdownResponse> GetByCategoryAsync(int? year, int? month, CancellationToken ct = default)
    {
        var period = ResolvePeriod(year, month); // null = todos os meses
        var totals = await _expenseRepository.GetTotalsByCategoryAsync(period?.StartUtc, period?.EndUtc, ct);

        var totalAmount = totals.Sum(t => t.Total);
        var items = totals
            .OrderByDescending(t => t.Total)
            .ThenBy(t => t.CategoryName)
            .Select(t => new CategorySpendingResponse(t.CategoryId, t.CategoryName, t.Total,
                totalAmount == 0 ? 0 : Math.Round(t.Total / totalAmount * 100, 1)))
            .ToList();

        return new CategoryBreakdownResponse(period?.Year, period?.Month, totalAmount, items);
    }

    public async Task<List<MonthOptionResponse>> GetAvailableMonthsAsync(CancellationToken ct = default)
    {
        var months = await _expenseRepository.GetMonthsWithExpensesAsync(ct);
        var current = CurrentMonth();
        if (!months.Contains(current))
            months.Insert(0, current);

        return months
            .Select(m => new MonthOptionResponse(m.Year, m.Month))
            .ToList();
    }

    private YearMonth CurrentMonth() => YearMonth.FromDate(_timeProvider.GetUtcNow().UtcDateTime);

    private static YearMonth? ResolvePeriod(int? year, int? month) => (year, month) switch
    {
        (null, null) => null,
        (int y, int m) => YearMonth.Create(y, m),
        _ => throw new DomainException("Informe ano e mes juntos")
    };
}
