package br.univille.fabsoft_backend.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Promocoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nome;
    private String descricao;
    private float descontoPercentual;
    private float descontoValorFixo;

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

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    private boolean ativo;
}
