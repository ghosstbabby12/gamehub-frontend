import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { VideojuegoService } from '../../services/videojuego.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../auth/auth.service';
import { VideojuegoDTO } from '../../models/videojuego.models';

@Component({
  selector: 'app-tienda-detalle',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './tienda-detalle.component.html',
  styleUrl: './tienda-detalle.component.css',
})
export class TiendaDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videojuegoService = inject(VideojuegoService);
  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  juego: VideojuegoDTO | null = null;
  loading = true;
  addingToCart = false;
  cartMsg = '';
  errorMsg = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.videojuegoService.getById(id).subscribe({
      next: (data) => {
        this.juego = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMsg = 'Juego no encontrado.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  agregarAlCarrito(): void {
    if (!this.juego) return;
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.addingToCart = true;
    this.carritoService.agregar(this.juego.id, 1).subscribe({
      next: () => {
        this.addingToCart = false;
        this.cartMsg = '¡Agregado al carrito!';
        this.cdr.markForCheck();
        setTimeout(() => { this.cartMsg = ''; this.cdr.markForCheck(); }, 2500);
      },
      error: () => { this.addingToCart = false; this.cdr.markForCheck(); },
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
