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
    private ItemMenuRepository repository; // injeta o repositório que conversa com o banco

    @Override // retorna todos os itens do menu
    public List<ItemMenu> getAll() {
        return repository.findAll();
    }

    @Override // salva um novo item de menu no banco
    public ItemMenu save(ItemMenu itemMenu) {
        return repository.save(itemMenu);
    }

    @Override // atualiza um item já existente
    public ItemMenu update(long id, ItemMenu itemMenu) throws Exception {
        // busca o item antigo pelo ID
        var itemAntigo = repository.getById(id);
        if(itemAntigo == null){
            throw new Exception("Item inexistente");
        }

        // atualiza os campos que podem ser alterados (menos o ID, que é chave primária)
        itemAntigo.setNome(itemMenu.getNome());
        itemAntigo.setDescricao(itemMenu.getDescricao());
        itemAntigo.setPreco(itemMenu.getPreco());
        itemAntigo.setCategoria(itemMenu.getCategoria());
        itemAntigo.setDisponibilidade(itemMenu.getDisponibilidade()); // agora atualiza a disponibilidade também

        // salva no banco as alterações
        repository.save(itemAntigo);

        return itemAntigo; // retorna o item atualizado
    }

    //atualiza a disponibilidade do ItemMenu
    public ItemMenu atualizarDisponibilidade(long id, boolean disponibilidade) throws Exception {
        var itemAntigo = repository.findById(id).orElseThrow(() -> new Exception("Item inexistente"));

        itemAntigo.setDisponibilidade(disponibilidade);
        return repository.save(itemAntigo);
    }

    @Override // remove um item do banco
    public ItemMenu delete(long id) throws Exception {
        var itemAntigo = repository.getById(id);
        if(itemAntigo == null){
            throw new Exception("Item inexistente");
        }

        repository.delete(itemAntigo);
        return itemAntigo; // retorna o item deletado (só pra feedback)
    }
}



