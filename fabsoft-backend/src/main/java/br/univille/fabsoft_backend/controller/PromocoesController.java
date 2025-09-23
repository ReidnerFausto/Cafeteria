package br.univille.fabsoft_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.univille.fabsoft_backend.entity.Promocoes;
import br.univille.fabsoft_backend.entity.Promocoes;
import br.univille.fabsoft_backend.service.PromocoesService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1/promocoes")
public class PromocoesController {

    @Autowired
    private PromocoesService service;
    
    @GetMapping
    public ResponseEntity<List<Promocoes>> getPromocoes(){
        var listaPromocoes = service.getAll();

        return new ResponseEntity<List<Promocoes>>(listaPromocoes, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Promocoes> save(@Valid @RequestBody Promocoes promocoes, BindingResult result){
        if(promocoes == null){
            return ResponseEntity.badRequest().build();
        }
        if(result.hasErrors()){
            HttpHeaders headers = new HttpHeaders();
            String errorMessages = result.getAllErrors().stream().map(error -> error.getDefaultMessage()).collect(Collectors.joining(" "));
            headers.add("Erro", errorMessages);
            return new ResponseEntity<Promocoes>(promocoes, headers, HttpStatus.BAD_REQUEST);
        }
        if(promocoes.getId() == 0){
            promocoes = service.save(promocoes);
            return new ResponseEntity<Promocoes>(promocoes, HttpStatus.OK);
        }

        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Promocoes> update(@RequestBody Promocoes promocoes, @PathVariable long id){
        if(id <=0 || promocoes == null){
            return ResponseEntity.badRequest().build();
        }

        try {
            promocoes = service.update(id, promocoes);
            return new ResponseEntity<Promocoes>(promocoes, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT para atualizar apenas a disponibilidade
    @PutMapping("/{id}/status")
    public ResponseEntity<Promocoes> atualizarDisponibilidade(@PathVariable long id, @RequestBody boolean disponibilidade) {
        try {
            Promocoes statusAtualizado = service.atualizarStatus(id, disponibilidade);
            return new ResponseEntity<>(statusAtualizado, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
}
