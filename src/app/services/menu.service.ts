import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuOpcion } from '../models/menu.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/api/menu`;

  getMenu(): Observable<MenuOpcion[]> {
    return this.http.get<MenuOpcion[]>(this.API);
  }
}
