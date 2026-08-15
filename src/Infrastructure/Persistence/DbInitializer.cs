namespace FinChat.Infrastructure.Persistence;

using FinChat.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Aplica migrations pendentes no banco de dados automaticamente ao iniciar
        await context.Database.MigrateAsync();
    }
}
