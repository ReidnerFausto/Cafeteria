import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  
  apiURL = 'http://localhost:8080/api/v1/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiURL);
  }

  saveUsuario(usuario: Usuario){
    if(usuario.id){
      return this.http.put(this.apiURL + '/' + usuario.id, usuario)  
    }
    return this.http.post(this.apiURL, usuario)
  }

  excluirUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
