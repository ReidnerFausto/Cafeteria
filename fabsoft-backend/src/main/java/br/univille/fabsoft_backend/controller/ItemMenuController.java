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
}
