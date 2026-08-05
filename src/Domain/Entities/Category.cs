namespace FinChat.Domain.Entities;
using FinChat.Domain.Exceptions;

public class Category
{
    public Guid Id {get; private set;}
    public  string Name {get; private set;}
    public string? Description{get; private set;}

    private Category() {

    }
    public static Category Create(string name, string? description= null)
    {
        if(string.IsNullOrWhiteSpace(name))
        throw new DomainException("O nome de categoria nao pode ficar vazio");

        return new Category() {
            Id = Guid.NewGuid(),
            Name = name,
            Description= description
        };
    }

    public void Update(string name, string? description= null)
    {
        if(string.IsNullOrWhiteSpace(name))
        throw new DomainException("O nome de categoria nao pode ficar vazio");

        Name = name;
        Description= description;
    }
}