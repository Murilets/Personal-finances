using FinChat.Application.Dtos.Dashboard;
using FinChat.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinChat.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryResponse>> GetSummary([FromQuery] int? year, [FromQuery] int? month, CancellationToken ct)
        => Ok(await _dashboardService.GetSummaryAsync(year, month, ct));

    [HttpGet("by-category")]
    public async Task<ActionResult<CategoryBreakdownResponse>> GetByCategory([FromQuery] int? year, [FromQuery] int? month, CancellationToken ct)
        => Ok(await _dashboardService.GetByCategoryAsync(year, month, ct));

    [HttpGet("months")]
    public async Task<ActionResult<List<MonthOptionResponse>>> GetAvailableMonths(CancellationToken ct)
        => Ok(await _dashboardService.GetAvailableMonthsAsync(ct));
}
