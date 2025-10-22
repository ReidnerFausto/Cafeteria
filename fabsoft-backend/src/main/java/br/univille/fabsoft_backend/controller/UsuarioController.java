package br.univille.fabsoft_backend.controller;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import br.univille.fabsoft_backend.entity.Usuario;
import br.univille.fabsoft_backend.service.UsuarioService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService service;

    //metodo get que retorna o valor do banco de dados
    @GetMapping
    public ResponseEntity<List<Usuario>> getUsuario(){
        var listaUsuario = service.getAll();

        return new ResponseEntity<List<Usuario>>(listaUsuario, HttpStatus.OK);
    }

     //Post salva o valor no banco de dados
    @PostMapping                       //@valid força o spring a fazer a validacao dos parametros que foram especificados na entidade
    public ResponseEntity<Usuario> save(@Valid @RequestBody Usuario usuario, BindingResult result) {
        if (usuario == null) {
            return ResponseEntity.badRequest().build();// retorna o http status 400(badRequest) caso o item nao exista
        }
        if (result.hasErrors()) {
            HttpHeaders headers = new HttpHeaders();
            String errorMessages = result.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(" "));
            headers.add("Erro", errorMessages);
            return new ResponseEntity<Usuario>(usuario,headers,HttpStatus.BAD_REQUEST);
        }// forma performatica do spring reconhecer e imprimir os erros que foram feitos no entity
        if (usuario.getId() == 0) {
            // caso o item tenha id 0(nao esteja no banco de dados)
            usuario = service.save(usuario);// salva o item no banco de dados
            return new ResponseEntity<Usuario>(usuario, HttpStatus.OK);// Retorna o http status 200(OK)
        }
        return ResponseEntity.badRequest().build();// Caso seja algo fora do padrao retorna tambem o http status 400
    }

    //Put altera um valor do banco de dados
    @PutMapping("/{id}")
    //define o id que deve ser alterado caso contrario nao sera possivel especificar qual valor que sera alterado
    public ResponseEntity<Usuario> update(@RequestBody Usuario usuario, @PathVariable long id){
        if(id <=0 || usuario == null){
            return ResponseEntity.badRequest().build();
        }

        try {
            usuario = service.update(id, usuario);
            return new ResponseEntity<Usuario>(usuario, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    //define o id que deve ser excluido
    public ResponseEntity<Usuario> delete(@PathVariable long id){
        if(id <=0){//Se o id for menor ou igual a 0 retorna um badRequest
            return ResponseEntity.badRequest().build();
        }
        try {// retorna o itemMenu que foi apagado(uma boa pratica)
            var usuario = service.delete(id);
            return new ResponseEntity<Usuario>(usuario, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    

}
