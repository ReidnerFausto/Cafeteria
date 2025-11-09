import { Component } from '@angular/core';
import { Usuario } from '../model/usuario';
import { UsuarioService } from '../service/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-usuario',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
  providers: [UsuarioService]
})
export class UsuarioComponent {
  listaUsuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOninit(){
    this.usuarioService.getUsuarios().subscribe(Usuarios => {
      this.listaUsuarios = Usuarios;
    });
  }


  
}
