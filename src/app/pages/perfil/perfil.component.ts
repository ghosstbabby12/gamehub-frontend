import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { PedidoDTO } from '../../models/pedido.models';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);

  user = toSignal(this.authService.currentUser$, { initialValue: null });
  pedidos: PedidoDTO[] = [];
  loadingPedidos = true;
  expandedId: number | null = null;

  ngOnInit(): void {
    this.pedidoService.getMisPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.loadingPedidos = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loadingPedidos = false; this.cdr.markForCheck(); },
    });
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  estadoClass(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE: 'badge-pendiente',
      CONFIRMADO: 'badge-confirmado',
      ENVIADO: 'badge-enviado',
      ENTREGADO: 'badge-entregado',
      CANCELADO: 'badge-cancelado',
    };
    return map[estado] ?? 'badge-pendiente';
  }

  logout(): void {
    this.authService.logout();
  }
}
