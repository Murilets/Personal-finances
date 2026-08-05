namespace FinChat.Domain.Entities;
using FinChat.Domain.Exceptions;

public class Despesas
{
    public Guid Id {get; private set;}
    public  decimal Valor { get; private set; }
    public DateTime Data {get; private set;}
    public Guid CategoriaId { get; private set;}
    public string? Observacao {get; private set;}

   // Construtor privado: ninguém de fora consegue fazer "new Despesa()" e
    // deixar os campos num estado qualquer.
    private Despesa() {

    }
    // Único portão de entrada pra criar uma Despesa. Se a regra for violada,
    // nem chega a existir o objeto.
    public static Despesa Create(decimal valor, DateTime data, Guid categoriaId, string? observacao = null)
    {
        if (valor <=0)
            throw new  DomainException("Valor deve ser maior que zero");

            return new Despesa(){
                Id = Guid.NewGuid(),
                Valor = valor,
                Data = data,
                CategoriaId = categoriaId,
                Observacao = observacao
            };
    }
       // Alterar o valor também passa pela mesma regra — não existe um "set"
    // que burle a validação.
    public void Update(decimal newValue)
    {
        if (newValue <=0)
        throw new DomainException("Valor deve ser maior que zero");
        valor = newValue;
        
    }
}