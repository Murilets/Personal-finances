namespace Finchat.Application.Services;
using FinChat.Application.Dtos.Dashboard;
using Finchat.Application.Interfaces;
using Finchat.Domain.Interfaces;
using System;

public class DashboardService(IExpenseRepository expenseRepository, TimeProvider timeProvider) : IDashboardService
{
    public async Task<DashboardSummaryResponse> GetSummaryAsync(
        int year,
        int month,
        CancellationToken ct = default)
    {
        var period = ResolvePeriod(year, month) ?? CurrentMonth();

        var monthTotals = await _expenseRepository.GetTotalsByCategoryAsync(period.StartUtc, period.EndUtc, ct);

        var overallTotals = await _expenseRepository.GetTotalsByCategoryAsync(ct: ct);

        var top = monthTotals.Where(t => t.Total > 0)
        .OrderByDescending(luizets => luizets.Total)
        .ThenBy(t => t.CategoryName) 
        .FirstOrDefaultAsync();

    return new DashboardSummaryResponse(
    period.Year, period.Month,
    monthTotals.Sum(t => t.Total),
    overallTotals.Sum(t => t.Total),
    overallTotals.Count,
    top is null ? null : new TopCategoryResponse(top.CategoryName, top.Total)
);       
    }
    public async Task<CategoryBreakdownResponse> GetByCategoryIdAsync (int? year, int? month, CancellationToken ct = default)
    {
        var period = ResolvePeriod(year, month); // null the whole month and year
        var totals = await _expenseRepository
        .GetTotalsByCategoryAsync(period?.StartUtc, period?.EndUtc, ct);

        var totalAmount = totals.Sum(t => t.Total);
        var items = totals
        .OrderByDescending(t => t.Total).ThenBy(t => t.CategoryName )
        .Select(t => new CategorySpendingResponse(t.CategoryId, t.CategoryName, t.Total,
         totalAmount == 0 ? 0 : Math.Round(t.Total / totalAmount * 100, 1)))
         .ToList();

         return new CategoryBreakdownResponse(period?.Year, period?.Month, totalAmount, items);
    }
}