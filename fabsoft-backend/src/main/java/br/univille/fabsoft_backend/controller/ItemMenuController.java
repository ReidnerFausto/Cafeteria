package br.univille.fabsoft_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.univille.fabsoft_backend.entity.ItemMenu;
import br.univille.fabsoft_backend.service.ItemMenuService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/itensmenu")
public class ItemMenuController {

    @Autowired
    private ItemMenuService service;

    @GetMapping
    public ResponseEntity<List<ItemMenu>> getItemMenu() {

        var listaItemMenu = service.getAll();

        return new ResponseEntity<List<ItemMenu>>(listaItemMenu, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ItemMenu> save(@RequestBody ItemMenu itemMenu) {
        if (itemMenu == null) {
            return ResponseEntity.badRequest().build();// retorna o http status 400(badRequest) caso o item nao exista
        }
        if (itemMenu.getId() == 0) {
            // caso o item tenha id 0(nao esteja no banco de dados)
            itemMenu = service.save(itemMenu);// salva o item no banco de dados
            return new ResponseEntity<ItemMenu>(itemMenu, HttpStatus.OK);// Retorna o http status 200(OK)
        }
        return ResponseEntity.badRequest().build();// Caso seja algo fora do padrao retorna tambem o http status 400
    }
}
