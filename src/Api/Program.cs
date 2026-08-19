using FinChat.Api.Middleware;
using FinChat.Application;
using FinChat.Infrastructure;
using FinChat.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Adicionar a camada de Aplicação (Services e DTOs)
builder.Services.AddApplication();

// Adicionar a camada de Infraestrutura (AppDbContext, EF Core com PostgreSQL, Repositórios)
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Executar migrations e seed do banco de dados na inicialização
await DbInitializer.InitializeAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseMiddleware<DomainExceptionMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
