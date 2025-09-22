package br.univille.fabsoft_backend.service;

import java.util.List;

import br.univille.fabsoft_backend.entity.Pedido;

public interface PedidoService {
    List<Pedido> getAll();
    Pedido save(Pedido pedido);
    Pedido update(long id, Pedido pedido);
    Pedido finalizarPedido(long id);
}
