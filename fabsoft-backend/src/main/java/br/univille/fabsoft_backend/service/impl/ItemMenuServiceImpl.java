package br.univille.fabsoft_backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.univille.fabsoft_backend.entity.ItemMenu;
import br.univille.fabsoft_backend.entity.Promocoes;
import br.univille.fabsoft_backend.repository.ItemMenuRepository;
import br.univille.fabsoft_backend.service.ItemMenuService;

@Service
public class ItemMenuServiceImpl implements ItemMenuService {

    @Autowired
    private ItemMenuRepository repository;

    @Override
    public List<ItemMenu> getAll() {
        List<ItemMenu> itens = repository.findAll();

        for (ItemMenu item : itens) {
            if (item.getPrecoOriginal() == 0) {
                item.setPrecoOriginal(item.getPreco());
            }

            float precoBase = item.getPrecoOriginal();

            if (item.getPromocoes() != null) {
                for (Promocoes promo : item.getPromocoes()) {
                    if (promo.getStatus()) {
                        if (promo.getDescontoPercentual() > 0) {
                            precoBase = precoBase * (1 - promo.getDescontoPercentual() / 100);
                        } else if (promo.getDescontoValorFixo() > 0) {
                            precoBase = precoBase - promo.getDescontoValorFixo();
                        }
                    }
                }
            }

            item.setPreco(precoBase);
        }

        return itens;
    }

    @Override
    public ItemMenu save(ItemMenu itemMenu) {
        // garante precoOriginal no momento do save
        if (itemMenu.getPrecoOriginal() == 0) {
            itemMenu.setPrecoOriginal(itemMenu.getPreco());
        }
        return repository.save(itemMenu);
    }

    @Override
    public ItemMenu update(long id, ItemMenu itemMenu) throws Exception {
        var itemAntigo = repository.findById(id).orElseThrow(() -> new Exception("Item inexistente"));

        itemAntigo.setNome(itemMenu.getNome());
        itemAntigo.setDescricao(itemMenu.getDescricao());
        itemAntigo.setCategoria(itemMenu.getCategoria());
        itemAntigo.setDisponibilidade(itemMenu.getDisponibilidade());

        // atualiza preco e precoOriginal caso tenha promocao ativa
        if (itemMenu.getPreco() != itemAntigo.getPrecoOriginal()) {
            itemAntigo.setPrecoOriginal(itemMenu.getPreco());
        }

        itemAntigo.setPreco(itemMenu.getPreco());

        return repository.save(itemAntigo);
    }

    @Override
    public ItemMenu atualizarDisponibilidade(long id, boolean disponibilidade) throws Exception {
        var itemAntigo = repository.findById(id).orElseThrow(() -> new Exception("Item inexistente"));
        itemAntigo.setDisponibilidade(disponibilidade);
        return repository.save(itemAntigo);
    }

    @Override
    public ItemMenu delete(long id) throws Exception {
        var itemAntigo = repository.findById(id).orElseThrow(() -> new Exception("Item inexistente"));
        repository.delete(itemAntigo);
        return itemAntigo;
    }
}
