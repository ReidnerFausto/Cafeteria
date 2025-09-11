package br.univille.fabsoft_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.univille.fabsoft_backend.entity.ItemPedido;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {

    List<ItemPedido> findByIdAndQuantidadeAndPrecoUnitario(long id, int quantidade, float precoUnitario);

}