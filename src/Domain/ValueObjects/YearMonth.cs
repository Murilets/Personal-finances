namespace FinChat.Domain.ValueObjects;

using FinChat.Domain.Exceptions;

public sealed record YearMonth
{
    public int Year { get; }
    public int Month { get; }

    private YearMonth(int year, int month)
    {
      Year = year; Month = month;   
    }
    public static YearMonth Create(int year, int month)
    {
        if (month is < 1 or > 12)
        throw new DomainException ("Mes invalido");
        if (year is < 2000 or > 2100)
            throw new DomainException ("Ano invalido");
            return new YearMonth(year,month);   
    }
    public static YearMonth FromDate(DateTime date) => new (date.Year, date.Month);

    // range
    public DateTime StartUtc => new (Year, Month, 1, 0, 0, 0, DateTimeKind.Utc);
    public DateTime EndUtc => StartUtc.AddMonths(1);
}
