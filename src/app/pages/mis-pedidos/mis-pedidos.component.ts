import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { PedidoDTO } from '../../models/pedido.models';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.css',
})
export class MisPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: PedidoDTO[] = [];
  loading = false;
  expandedId: number | null = null;

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.loading = true;
    this.pedidoService.getMisPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  estadoClass(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE: 'estado-pendiente',
      CONFIRMADO: 'estado-confirmado',
      ENVIADO: 'estado-enviado',
      ENTREGADO: 'estado-entregado',
      CANCELADO: 'estado-cancelado',
    };
    return map[estado] ?? 'estado-pendiente';
  }
}
