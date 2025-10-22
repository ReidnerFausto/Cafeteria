package br.univille.fabsoft_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Promocoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nome;
    private String descricao;
    private float descontoPercentual;
    private float descontoValorFixo;
    private boolean status;
    @ManyToOne
    @JoinColumn(name = "item_menu_id")
    @JsonBackReference
    private ItemMenu itemMenu;

    public ItemMenu getItemMenu() {
        return itemMenu;
    }

    public void setItemMenu(ItemMenu itemMenu) {
        this.itemMenu = itemMenu;
    }

    // Getters & Setters
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

    public float getDescontoPercentual() {
        return descontoPercentual;
    }

    public void setDescontoPercentual(float descontoPercentual) {
        this.descontoPercentual = descontoPercentual;
    }

    public float getDescontoValorFixo() {
        return descontoValorFixo;
    }

    public void setDescontoValorFixo(float descontoValorFixo) {
        this.descontoValorFixo = descontoValorFixo;
    }

    public boolean getStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
