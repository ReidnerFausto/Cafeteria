package br.univille.fabsoft_backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.univille.fabsoft_backend.entity.Promocoes;
import br.univille.fabsoft_backend.repository.PromocoesRepository;
import br.univille.fabsoft_backend.service.PromocoesService;

@Service
public class PromocoesServiceImpl implements PromocoesService{
    @Autowired
    private PromocoesRepository repository;

    @Override
    public List<Promocoes> getAll(){
        return repository.findAll();
    }

    @Override
    public Promocoes save(Promocoes promocoes){
        return repository.save(promocoes);
    }

    @Override
    public Promocoes update(long id, Promocoes promocoes) throws Exception{
        var promocoesAntiga = repository.getById(id);
        if(promocoesAntiga == null){
            throw new Exception("Promoção inexistente");
        }
        promocoesAntiga.setNome(promocoesAntiga.getNome());
        promocoesAntiga.setDescricao(promocoesAntiga.getDescricao());
        promocoesAntiga.setDescontoPercentual(promocoesAntiga.getDescontoPercentual());
        promocoesAntiga.setDescontoValorFixo(promocoesAntiga.getDescontoValorFixo());

        repository.save(promocoes);

        return promocoes;
    }

    @Override
    public Promocoes atualizarStatus(long id, boolean status) throws Exception {
        var promocoesAntiga = repository.findById(id).orElseThrow(() -> new Exception("Promoção inexistente"));

        promocoesAntiga.setStatus(status);
        return repository.save(promocoesAntiga);
    }
}   
