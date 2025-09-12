package br.univille.fabsoft_backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.univille.fabsoft_backend.entity.ItemMenu;
import br.univille.fabsoft_backend.repository.ItemMenuRepository;
import br.univille.fabsoft_backend.service.ItemMenuService;

@Service
public class ItemMenuServiceImpl implements ItemMenuService {

    @Autowired
    private ItemMenuRepository repository;

    @Override
    public List<ItemMenu> getAll() {
        return repository.findAll();
    }

    @Override
    public ItemMenu save(ItemMenu itemMenu) {
        return repository.save(itemMenu);
    }

}
