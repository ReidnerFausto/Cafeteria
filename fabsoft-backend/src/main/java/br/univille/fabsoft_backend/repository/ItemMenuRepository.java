package br.univille.fabsoft_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.univille.fabsoft_backend.entity.ItemMenu;

@Repository
public interface ItemMenuRepository extends JpaRepository<ItemMenu, Long> {

    List<ItemMenu> findByIdAndNome(long id, String nome);
}
