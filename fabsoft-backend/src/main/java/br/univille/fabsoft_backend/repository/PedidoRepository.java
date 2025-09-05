package br.univille.fabsoft_backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.univille.fabsoft_backend.entity.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long>{

    List<Pedido> findbyIdAndTotalAndDescricao(long id, float total, String descricao);
}