using FinChat.Application.Dtos.Categories;
using FinChat.Application.Interfaces;
using FinChat.Domain.Entities;
using FinChat.Domain.Exceptions;
using FinChat.Domain.Interfaces;

namespace FinChat.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repository;

    public CategoryService(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<CategoryResponse>> GetAllAsync(CancellationToken ct = default)
    {
        var categories = await _repository.GetAllAsync(ct);
        return categories.Select(MapToResponse).ToList();
    }

    public async Task<CategoryResponse> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var category = await _repository.GetByIdAsync(id, ct)
            ?? throw new DomainException($"Categoria {id} nao encontrada");
        return MapToResponse(category);
    }

    public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request, CancellationToken ct = default)
    {
        if (await _repository.ExistsByNameAsync(request.Name, ct))
            throw new DomainException($"Categoria com o nome '{request.Name}' ja existe");

        var category = Category.Create(request.Name, request.Description);
        await _repository.AddAsync(category, ct);
        return MapToResponse(category);
    }

    public async Task<CategoryResponse> UpdateAsync(Guid id, UpdateCategoryRequest request, CancellationToken ct = default)
    {
        var category = await _repository.GetByIdAsync(id, ct)
            ?? throw new DomainException($"Categoria {id} nao encontrada");

        if (await _repository.ExistsByNameAsync(request.Name, ct) && category.Name != request.Name)
            throw new DomainException($"Já existe uma categoria com o nome '{request.Name}'.");

        category.Update(request.Name, request.Description);
        await _repository.UpdateAsync(category, ct);

        return MapToResponse(category);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var category = await _repository.GetByIdAsync(id, ct)
            ?? throw new DomainException($"Categoria {id} nao encontrada");

        await _repository.DeleteAsync(category, ct);
    }

    private static CategoryResponse MapToResponse(Category category)
        => new(category.Id, category.Name, category.Description);
}