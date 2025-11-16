import { Component, ViewChild, ElementRef } from '@angular/core';
import { Usuario } from '../model/usuario';
import { UsuarioService } from '../service/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";

declare var bootstrap: any;

@Component({
  selector: 'app-usuario',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
  providers: [UsuarioService, Router]
})
export class UsuarioComponent {

  listaUsuarios: Usuario[] = [];
  usuarioSelecionado!: Usuario;
  modal: any;

  @ViewChild('myModal') modalElement!: ElementRef;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(){
    console.log("Carregando usuarios...");
    this.usuarioService.getUsuarios().subscribe(Usuarios => {
      this.listaUsuarios = Usuarios;
    });
  }

  novo(){
    this.router.navigate(['usuarios/novo']);
  }

  alterar(usuario: Usuario){
    this.router.navigate(['usuarios/alterar', usuario.id]);
  }

  abrirConfirmacao(usuario: Usuario){
    this.usuarioSelecionado = usuario;
    this.modal = new bootstrap.Modal(this.modalElement.nativeElement);
    this.modal.show();
  }

  fecharConfirmacao(){
    this.modal.hide();
  }

  confirmarExclusao(){
    this.usuarioService.excluirUsuario(this.usuarioSelecionado.id.toString())
      .subscribe(
        () => {
          this.fecharConfirmacao();
          this.usuarioService.getUsuarios().subscribe(
            usuarios => this.listaUsuarios = usuarios
          );
        },
        error => {
          console.error('Erro ao excluir usuario', error);
        }
      );
  }
}
