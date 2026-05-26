import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDTO, UsuarioAdmin } from '../models/admin.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/api/admin`;

  getUsuarios(): Observable<UsuarioAdmin[]> {
    return this.http.get<UsuarioAdmin[]>(`${this.BASE}/usuarios`);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/usuarios/${id}`);
  }

  updateRol(id: number, rol: string): Observable<UsuarioAdmin> {
    return this.http.patch<UsuarioAdmin>(`${this.BASE}/usuarios/${id}/rol`, null, { params: { rol } });
  }

  getEmpleados(): Observable<AdminDTO[]> {
    return this.http.get<AdminDTO[]>(`${this.BASE}/empleados`);
  }

  crearEmpleado(dto: { nombre: string; email: string; cargo: string }): Observable<AdminDTO> {
    return this.http.post<AdminDTO>(`${this.BASE}/empleados`, dto);
  }
}
