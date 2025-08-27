## Histórias de Usuário

1. **Cadastro Rápido de Produtos**  
   **Como** gerente,  
   **quero** cadastrar produtos rapidamente através de uma tela simples e intuitiva,  
   **para que** eu possa atualizar o estoque sem perder tempo.

2. **Visualização Intuitiva do Estoque**  
   **Como** responsável pelo estoque,  
   **quero** visualizar uma lista clara dos produtos com alertas visuais para itens com baixa quantidade,  
   **para que** eu possa identificar rapidamente o que precisa ser comprado.

3. **Registro Simplificado de Vendas**  
   **Como** atendente,  
   **quero** registrar vendas facilmente, buscando produtos por nome ou código e adicionando-os com poucos cliques,  
   **para que** eu possa atender os clientes de forma rápida e precisa.

4. **Relatórios Visuais de Vendas e Estoque**  
   **Como** gerente,  
   **quero** dashboards com gráficos claros mostrando vendas, produtos mais vendidos e níveis de estoque,  
   **para que** eu possa tomar decisões rápidas e informadas.

5. **Navegação Clara e Responsiva**  
   **Como** usuário do sistema,  
   **quero** uma navegação simples e responsiva em diferentes dispositivos,  
   **para que** eu possa usar o sistema de forma eficiente mesmo em momentos de movimento intenso.


``` mermaid

---
title: DIAGRAMA DE ENTIDADE
---

classDiagram
    class Usuario {
        - email: String
        - senha: String
        + fazerLogin(): boolean
        + getEmail(): String
        + setEmail(email: String)
        + getSenha(): String
        + setSenha(senha: String)
    }

    class ItemMenu {
        - id: int
        - nome: String
        - categoria: String
        - descricao: String
        - preco: float
        - imagem: String
        + getId(): int
        + setId(id: int)
        + getNome(): String
        + setNome(nome: String)
        + getCategoria(): String
        + setCategoria(categoria: String)
        + getDescricao(): String
        + setDescricao(descricao: String)
        + getPreco(): float
        + setPreco(preco: float)
        + getImagem(): String
        + setImagem(imagem: String)
        + atualizarPreco(preco: float)
    }

    class ItemPedido {
        - quantidade: int
        - precoUnitario: float
        + getQuantidade(): int
        + setQuantidade(qtd: int)
        + getPrecoUnitario(): float
        + setPrecoUnitario(preco: float)
        + calcularSubtotal(): float
    }

    class Pedido {
        - id: String
        - total: float
        - itens: List~ItemPedido~
        + getId(): String
        + setId(id: String)
        + getTotal(): float
        + setTotal(total: float)
        + getItens(): List~ItemPedido~
        + setItens(itens: List~ItemPedido~)
        + adicionarItem(item: ItemPedido)
        + removerItem(item: ItemPedido)
        + calcularTotal(): float
    }

    class Estoque {
        - itensEstoque: Map~ItemMenu, int~
        + atualizarEstoque(item: ItemMenu, quantidade: int)
        + consultarEstoque(item: ItemMenu): int
    }

    %% Relações
    Usuario "1" --> "*" Pedido : realiza
    Pedido "1" --> "*" ItemPedido : contem
    ItemPedido "*" --> "1" ItemMenu : referencia
    Pedido "*" ..> "1" Estoque : atualiza/consulta


```