import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoDTO } from '../models/pedido.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/api/pedidos`;

  getMisPedidos(): Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(`${this.BASE}/mis-pedidos`);
  }

  getById(id: number): Observable<PedidoDTO> {
    return this.http.get<PedidoDTO>(`${this.BASE}/${id}`);
  }

  getAll(): Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(this.BASE);
  }

  actualizarEstado(id: number, estado: string): Observable<PedidoDTO> {
    return this.http.patch<PedidoDTO>(`${this.BASE}/${id}/estado`, null, { params: { estado } });
  }

  crearAdmin(dto: { correoCliente: string; estado: string; items: { videojuegoId: number; cantidad: number }[] }): Observable<PedidoDTO> {
    return this.http.post<PedidoDTO>(`${this.BASE}/admin`, dto);
  }

  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }
}
