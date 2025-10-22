package br.univille.fabsoft_backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.univille.fabsoft_backend.entity.ItemMenu;
import br.univille.fabsoft_backend.entity.Promocoes;
import br.univille.fabsoft_backend.repository.ItemMenuRepository;
import br.univille.fabsoft_backend.repository.PromocoesRepository;
import br.univille.fabsoft_backend.service.PromocoesService;

@Service
public class PromocoesServiceImpl implements PromocoesService {
    
    @Autowired
    private PromocoesRepository repository;

    @Autowired
    private ItemMenuRepository itemMenuRepository;

    @Override
    public List<Promocoes> getAll() {
        return repository.findAll();
    }

    @Override
    public Promocoes save(Promocoes promocoes) {
        if (promocoes.getItemMenu() != null && promocoes.getItemMenu().getId() != 0) {
            ItemMenu item = itemMenuRepository.findById(promocoes.getItemMenu().getId()).orElseThrow(() -> new RuntimeException("ItemMenu inexistente"));
            promocoes.setItemMenu(item);
        }
        return repository.save(promocoes);
    }

    @Override
    public Promocoes update(long id, Promocoes promocoes) throws Exception {
        Promocoes promocoesAntiga = repository.findById(id).orElseThrow(() -> new Exception("Promoção inexistente"));

        promocoesAntiga.setNome(promocoes.getNome());
        promocoesAntiga.setDescricao(promocoes.getDescricao());
        promocoesAntiga.setDescontoPercentual(promocoes.getDescontoPercentual());
        promocoesAntiga.setDescontoValorFixo(promocoes.getDescontoValorFixo());
        promocoesAntiga.setStatus(promocoes.getStatus());

        return repository.save(promocoesAntiga);
    }

    @Override
    public Promocoes atualizarStatus(long id, boolean status) throws Exception {
        Promocoes promocoesAntiga = repository.findById(id).orElseThrow(() -> new Exception("Promoção inexistente"));

        promocoesAntiga.setStatus(status);

        ItemMenu item = promocoesAntiga.getItemMenu();
        if (item != null) {
            float precoOriginal = item.getPrecoOriginal(); // usar precoOriginal fixo
            if (status) {
                if (promocoesAntiga.getDescontoPercentual() > 0) {
                    item.setPreco(precoOriginal * (1 - promocoesAntiga.getDescontoPercentual() / 100));
                } else if (promocoesAntiga.getDescontoValorFixo() > 0) {
                    item.setPreco(precoOriginal - promocoesAntiga.getDescontoValorFixo());
                }
            } else {
                item.setPreco(precoOriginal); // desativa promoção
            }
        itemMenuRepository.save(item);
}

        return repository.save(promocoesAntiga);
    }
}
