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

    @Override//implementa o get
    public List<ItemMenu> getAll() {
        return repository.findAll();
    }

    @Override //implementa o save
    public ItemMenu save(ItemMenu itemMenu) {
        return repository.save(itemMenu);
    }

    @Override //implementa o update
    public ItemMenu update(long id, ItemMenu itemMenu) throws Exception{
        var itemAntigo = repository.getById(id);
        if(itemAntigo == null){
            throw new Exception("Item inexistente");
        }
        //Aqui voce criar um set e get para cada variavel que pode ser atualizada com excecao do Id o usuario nao deve ter permissao de atualizar a chave primaria
        itemAntigo.setNome(itemMenu.getNome());
        itemAntigo.setDescricao(itemMenu.getDescricao());
        itemAntigo.setPreco(itemMenu.getPreco());
        itemAntigo.setCategoria(itemMenu.getCategoria());

        repository.save(itemAntigo);//Salva a alteracao no banco de dados

        return itemAntigo;
    }

    @Override // implementa o delete
    public ItemMenu delete(long id) throws Exception {
        var itemAntigo = repository.getById(id);
        if(itemAntigo == null){
            throw new Exception("Item inexistente");
        }

        repository.delete(itemAntigo);
        return itemAntigo;
    }
}


