package br.univille.fabsoft_backend.service;

import java.util.List;

import br.univille.fabsoft_backend.entity.ItemMenu;

public interface ItemMenuService {
    List<ItemMenu> getAll();

    ItemMenu save(ItemMenu itemMenu);
}
