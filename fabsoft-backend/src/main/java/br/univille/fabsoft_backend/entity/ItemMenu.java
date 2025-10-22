package br.univille.fabsoft_backend.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;


@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ItemMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @NotBlank(message = "Nome do produto não pode ser em branco")//usado para não permitir que um valor em branco seja salvo no banco de dados
    private String nome;
    @NotBlank(message = "Descrição do produto não pode ser em branco")
    private String descricao;
    private String categoria;

    private float precoOriginal; // preço base do item
    private float preco;         // preço atual (com promoção se houver)

    @OneToMany(mappedBy = "itemMenu", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Promocoes> promocoes; //Integra as promocoes aos itens do menu

    private boolean disponibilidade; //Define se o produto esta disponivel ou não

    // GETTERS E SETTERS
    
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public float getPreco() {
        return preco;
    }

    public void setPreco(float preco) {
        this.preco = preco;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public boolean getDisponibilidade() {
        return disponibilidade;
    }

    public void setDisponibilidade(boolean disponibilidade) {
        this.disponibilidade = disponibilidade;
    }

    public List<Promocoes> getPromocoes() {
        return promocoes;
    }

    public void setPromocoes(List<Promocoes> promocoes) {
        this.promocoes = promocoes;
    }

        public float getPrecoOriginal() {
        return precoOriginal;
    }

    public void setPrecoOriginal(float precoOriginal) {
        this.precoOriginal = precoOriginal;
    }


}
