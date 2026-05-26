import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { VideojuegoService } from '../../services/videojuego.service';
import { PedidoDTO } from '../../models/pedido.models';
import { VideojuegoDTO } from '../../models/videojuego.models';

const ESTADOS = ['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

interface ItemForm { videojuegoId: number; cantidad: number; }

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, CurrencyPipe, DatePipe],
  templateUrl: './admin-pedidos.component.html',
  styleUrl: './admin-pedidos.component.css',
})
export class AdminPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private videojuegoService = inject(VideojuegoService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: PedidoDTO[] = [];
  filtered: PedidoDTO[] = [];
  videojuegos: VideojuegoDTO[] = [];
  estados = ESTADOS;
  filtroEstado = '';
  loading = false;
  expandedId: number | null = null;
  successMsg = '';
  errorMsg = '';

  showCreateForm = false;
  createCorreo = '';
  createEstado = 'PENDIENTE';
  createItems: ItemForm[] = [{ videojuegoId: 0, cantidad: 1 }];
  saving = false;

  ngOnInit(): void {
    this.loadAll();
    this.videojuegoService.getAll().subscribe({
      next: (data) => { this.videojuegos = data; this.cdr.markForCheck(); },
    });
  }

  loadAll(): void {
    this.loading = true;
    this.pedidoService.getAll().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  applyFilter(): void {
    this.filtered = this.filtroEstado
      ? this.pedidos.filter((p) => p.estado === this.filtroEstado)
      : [...this.pedidos];
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  cambiarEstado(pedido: PedidoDTO, nuevoEstado: string): void {
    this.pedidoService.actualizarEstado(pedido.id, nuevoEstado).subscribe({
      next: (updated) => {
        const idx = this.pedidos.findIndex((p) => p.id === pedido.id);
        if (idx !== -1) this.pedidos[idx] = updated;
        this.applyFilter();
        this.showSuccess('Estado actualizado.');
        this.cdr.markForCheck();
      },
      error: () => { this.errorMsg = 'Error al actualizar estado.'; this.cdr.markForCheck(); },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este pedido?')) return;
    this.pedidoService.deleteAdmin(id).subscribe({
      next: () => {
        this.pedidos = this.pedidos.filter((p) => p.id !== id);
        this.applyFilter();
        this.showSuccess('Pedido eliminado.');
        this.cdr.markForCheck();
      },
      error: () => { this.errorMsg = 'Error al eliminar pedido.'; this.cdr.markForCheck(); },
    });
  }

  addItem(): void {
    this.createItems = [...this.createItems, { videojuegoId: 0, cantidad: 1 }];
  }

  removeItem(i: number): void {
    this.createItems = this.createItems.filter((_, idx) => idx !== i);
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.createCorreo = '';
    this.createEstado = 'PENDIENTE';
    this.createItems = [{ videojuegoId: 0, cantidad: 1 }];
    this.errorMsg = '';
  }

  cancelCreate(): void {
    this.showCreateForm = false;
  }

  submitCreate(): void {
    if (!this.createCorreo.trim()) { this.errorMsg = 'El correo del cliente es obligatorio.'; return; }
    const items = this.createItems.filter(i => i.videojuegoId > 0 && i.cantidad > 0);
    if (items.length === 0) { this.errorMsg = 'Agrega al menos un ítem válido.'; return; }

    this.saving = true;
    this.errorMsg = '';
    this.pedidoService.crearAdmin({
      correoCliente: this.createCorreo.trim(),
      estado: this.createEstado,
      items,
    }).subscribe({
      next: (nuevo) => {
        this.pedidos = [nuevo, ...this.pedidos];
        this.applyFilter();
        this.showCreateForm = false;
        this.saving = false;
        this.showSuccess('Pedido creado.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = (err.error?.message as string) ?? 'Error al crear pedido.';
        this.cdr.markForCheck();
      },
    });
  }

  estadoClass(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE: 'badge-pendiente', CONFIRMADO: 'badge-confirmado',
      ENVIADO: 'badge-enviado', ENTREGADO: 'badge-entregado', CANCELADO: 'badge-cancelado',
    };
    return map[estado] ?? 'badge-pendiente';
  }

  private showSuccess(msg: string): void {
    this.successMsg = msg;
    this.cdr.markForCheck();
    setTimeout(() => { this.successMsg = ''; this.cdr.markForCheck(); }, 3000);
  }
}
