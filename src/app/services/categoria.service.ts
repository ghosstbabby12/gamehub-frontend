import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaDTO } from '../models/videojuego.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/api/categorias`;

  getAll(): Observable<CategoriaDTO[]> {
    return this.http.get<CategoriaDTO[]>(this.BASE);
  }

  getById(id: number): Observable<CategoriaDTO> {
    return this.http.get<CategoriaDTO>(`${this.BASE}/${id}`);
  }

  crear(dto: { nombre: string; descripcion: string }): Observable<CategoriaDTO> {
    return this.http.post<CategoriaDTO>(this.BASE, dto);
  }

  actualizar(id: number, dto: { nombre: string; descripcion: string }): Observable<CategoriaDTO> {
    return this.http.put<CategoriaDTO>(`${this.BASE}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }
}
