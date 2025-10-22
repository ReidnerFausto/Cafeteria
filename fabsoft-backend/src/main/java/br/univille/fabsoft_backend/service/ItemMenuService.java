package br.univille.fabsoft_backend.service;

import java.util.List;

import br.univille.fabsoft_backend.entity.ItemMenu;

public interface ItemMenuService {
    List<ItemMenu> getAll();

    ItemMenu save(ItemMenu itemMenu);

    ItemMenu update(long id, ItemMenu itemMenu) throws Exception;
    
    ItemMenu atualizarDisponibilidade(long id, boolean disponibilidade) throws Exception;

    ItemMenu delete(long id) throws Exception;
}
