using FinChat.Api.Middleware;
using FinChat.Application;
using FinChat.Infrastructure;
using FinChat.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

//CORS config (allows frontend request)
builder.Services.AddCors(options => 
{
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin()   // allows any origin
              .AllowAnyMethod()   // allows any method(get,post, put, delete)
              .AllowAnyHeader();  // allows any header(customized Http headers)
    });
});

// Add Application layer (Services and DTOs)
builder.Services.AddApplication();

// Add Infrastructure layer (AppDbContext, EF Core with PostgreSQL, Repositories)
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// run migrations and seed
await DbInitializer.InitializeAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// global exception middleware
app.UseMiddleware<DomainExceptionMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();