package br.univille.fabsoft_backend.service;

import java.util.List;

import br.univille.fabsoft_backend.entity.Promocoes;

public interface  PromocoesService {
    List<Promocoes> getAll();

    Promocoes save(Promocoes promocoes);

    Promocoes update(long id, Promocoes promocoes) throws Exception;

    Promocoes atualizarStatus(long id, boolean status) throws Exception;

}
