import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarritoDTO } from '../models/carrito.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/api/carrito`;

  getCarrito(): Observable<CarritoDTO> {
    return this.http.get<CarritoDTO>(this.BASE);
  }

  agregar(videojuegoId: number, cantidad: number): Observable<CarritoDTO> {
    return this.http.post<CarritoDTO>(`${this.BASE}/agregar`, { videojuegoId, cantidad });
  }

  actualizarItem(id: number, cantidad: number): Observable<CarritoDTO> {
    return this.http.put<CarritoDTO>(`${this.BASE}/item/${id}`, null, {
      params: { cantidad },
    });
  }

  eliminarItem(id: number): Observable<CarritoDTO> {
    return this.http.delete<CarritoDTO>(`${this.BASE}/item/${id}`);
  }

  vaciar(): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/vaciar`);
  }

  checkout(): Observable<unknown> {
    return this.http.post<unknown>(`${this.BASE}/checkout`, {});
  }
}
