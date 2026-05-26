import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { CarritoDTO } from '../../models/carrito.models';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent implements OnInit {
  private carritoService = inject(CarritoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  carrito: CarritoDTO | null = null;
  loading = false;
  checkingOut = false;
  mensaje = '';
  mensajeError = '';

  ngOnInit(): void {
    this.loadCarrito();
  }

  loadCarrito(): void {
    this.loading = true;
    this.carritoService.getCarrito().subscribe({
      next: (data) => {
        this.carrito = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  actualizarCantidad(itemId: number, nuevaCantidad: number): void {
    if (nuevaCantidad < 1) {
      this.eliminarItem(itemId);
      return;
    }
    this.carritoService.actualizarItem(itemId, nuevaCantidad).subscribe({
      next: (data) => { this.carrito = data; this.cdr.markForCheck(); },
    });
  }

  eliminarItem(itemId: number): void {
    this.carritoService.eliminarItem(itemId).subscribe({
      next: (data) => { this.carrito = data; this.cdr.markForCheck(); },
    });
  }

  vaciarCarrito(): void {
    if (!confirm('¿Seguro que deseas vaciar el carrito?')) return;
    this.carritoService.vaciar().subscribe({
      next: () => this.loadCarrito(),
    });
  }

  checkout(): void {
    this.checkingOut = true;
    this.mensajeError = '';
    this.carritoService.checkout().subscribe({
      next: () => {
        this.checkingOut = false;
        this.cdr.markForCheck();
        this.router.navigate(['/mis-pedidos']);
      },
      error: (err) => {
        this.checkingOut = false;
        this.mensajeError = (err.error?.message as string) ?? 'Error al confirmar el pedido.';
        this.cdr.markForCheck();
      },
    });
  }

  irATienda(): void {
    this.router.navigate(['/tienda']);
  }
}
