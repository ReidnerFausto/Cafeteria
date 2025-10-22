package br.univille.fabsoft_backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.univille.fabsoft_backend.entity.Usuario;
import br.univille.fabsoft_backend.repository.UsuarioRepository;
import br.univille.fabsoft_backend.service.UsuarioService;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    @Autowired
    private UsuarioRepository repository;

    @Override //implementa o get dos usuarios existente
    public List<Usuario> getAll() {
        return repository.findAll();
    }

    @Override //implementa o save de um novo usuario
    public Usuario save(Usuario usuario){
        return repository.save(usuario);
    }

    @Override //implementa o update
    public Usuario update(long id, Usuario usuario) throws Exception{
        var usuarioAntigo = repository.getById(id);
        if(usuarioAntigo == null){
            throw new Exception("Item inexistente");
        }
        //Aqui cria um set e get para cada variavel que pode ser atualizada com excecao do Id, o usuario nao deve ter permissao de atualizar a chave primaria(ID)
        usuarioAntigo.setEmail(usuario.getEmail());
        usuarioAntigo.setSenha(usuario.getSenha());


        repository.save(usuarioAntigo);//Salva a alteracao no banco de dados

        return usuarioAntigo;
    }

    @Override // implementa o delete
    public Usuario delete(long id) throws Exception {
        var usuarioAntigo = repository.getById(id);
        
        if(usuarioAntigo == null){
            throw new Exception("Usuario inexistente");
        }

        repository.delete(usuarioAntigo);
        return usuarioAntigo;
    }

}
