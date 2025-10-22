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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.univille.fabsoft_backend.entity.Promocoes;
import br.univille.fabsoft_backend.service.PromocoesService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/v1/promocoes")
public class PromocoesController {

    @Autowired
    private PromocoesService service;

    @GetMapping
    public ResponseEntity<List<Promocoes>> getPromocoes() {
        List<Promocoes> listaPromocoes = service.getAll();
        return ResponseEntity.ok(listaPromocoes);
    }

    @PostMapping
    public ResponseEntity<Promocoes> save(@Valid @RequestBody Promocoes promocoes, BindingResult result) {
        if (promocoes == null) {
            return ResponseEntity.badRequest().build();
        }

        if (result.hasErrors()) {
            String errorMessages = result.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(" "));
            HttpHeaders headers = new HttpHeaders();
            headers.add("Erro", errorMessages);
            return new ResponseEntity<>(promocoes, headers, HttpStatus.BAD_REQUEST);
        }

        Promocoes novaPromocao = service.save(promocoes);
        return ResponseEntity.ok(novaPromocao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Promocoes> update(@RequestBody Promocoes promocoes, @PathVariable long id) {
        try {
            Promocoes promocaoAtualizada = service.update(id, promocoes);
            return ResponseEntity.ok(promocaoAtualizada);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Promocoes> atualizarDisponibilidade(@PathVariable long id, @RequestBody boolean status) {
        try {
            Promocoes promocaoAtualizada = service.atualizarStatus(id, status);
            return ResponseEntity.ok(promocaoAtualizada);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
}
