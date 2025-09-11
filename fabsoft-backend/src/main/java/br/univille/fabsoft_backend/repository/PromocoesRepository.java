package br.univille.fabsoft_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.univille.fabsoft_backend.entity.Promocoes;

@Repository
public interface PromocoesRepository extends JpaRepository<Promocoes, Long> {
    List<Promocoes> findByAtivoTrue(); // retorna as promcoes ativas

    List<Promocoes> findByAtivoFalse(); // retorna as promocoes inativas

    List<Promocoes> findByAtivoTrueAndNomeContainingIgnoreCase(String nome);

}
