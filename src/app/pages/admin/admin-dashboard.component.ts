import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import { VideojuegoService } from '../../services/videojuego.service';
import { CategoriaService } from '../../services/categoria.service';
import { PedidoService } from '../../services/pedido.service';

function safe<T>(obs: Observable<T[]>): Observable<T[]> {
  return obs.pipe(
    timeout(8000),
    catchError(() => of([] as T[]))
  );
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private videojuegoService = inject(VideojuegoService);
  private categoriaService = inject(CategoriaService);
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);

  totalUsuarios = 0;
  totalJuegos = 0;
  totalCategorias = 0;
  totalPedidos = 0;
  loading = true;
  backendOffline = false;

  ngOnInit(): void {
    forkJoin({
      usuarios: safe(this.adminService.getUsuarios()),
      juegos: safe(this.videojuegoService.getAll()),
      categorias: safe(this.categoriaService.getAll()),
      pedidos: safe(this.pedidoService.getAll()),
    }).subscribe((res) => {
      this.totalUsuarios = res.usuarios.length;
      this.totalJuegos = res.juegos.length;
      this.totalCategorias = res.categorias.length;
      this.totalPedidos = res.pedidos.length;
      this.backendOffline =
        res.juegos.length === 0 && res.categorias.length === 0;
      this.loading = false;
      this.cdr.markForCheck();
    });
  }
}
