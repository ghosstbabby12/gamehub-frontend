import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideojuegoDTO, VideojuegoCreateDTO } from '../models/videojuego.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VideojuegoService {
  private http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/api/videojuegos`;

  getAll(): Observable<VideojuegoDTO[]> {
    return this.http.get<VideojuegoDTO[]>(this.BASE);
  }

  getById(id: number): Observable<VideojuegoDTO> {
    return this.http.get<VideojuegoDTO>(`${this.BASE}/${id}`);
  }

  buscar(titulo: string): Observable<VideojuegoDTO[]> {
    return this.http.get<VideojuegoDTO[]>(`${this.BASE}/buscar`, { params: { titulo } });
  }

  porCategoria(id: number): Observable<VideojuegoDTO[]> {
    return this.http.get<VideojuegoDTO[]>(`${this.BASE}/categoria/${id}`);
  }

  porPlataforma(plataforma: string): Observable<VideojuegoDTO[]> {
    return this.http.get<VideojuegoDTO[]>(`${this.BASE}/plataforma/${plataforma}`);
  }

  crear(dto: VideojuegoCreateDTO): Observable<VideojuegoDTO> {
    return this.http.post<VideojuegoDTO>(this.BASE, dto);
  }

  actualizar(id: number, dto: VideojuegoCreateDTO): Observable<VideojuegoDTO> {
    return this.http.put<VideojuegoDTO>(`${this.BASE}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }
}
