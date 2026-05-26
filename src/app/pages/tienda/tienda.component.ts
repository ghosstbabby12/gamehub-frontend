import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { VideojuegoService } from '../../services/videojuego.service';
import { CategoriaService } from '../../services/categoria.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../auth/auth.service';
import { VideojuegoDTO, CategoriaDTO, PLATAFORMAS } from '../../models/videojuego.models';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css',
})
export class TiendaComponent implements OnInit {
  private videojuegoService = inject(VideojuegoService);
  private categoriaService = inject(CategoriaService);
  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  videojuegos: VideojuegoDTO[] = [];
  categorias: CategoriaDTO[] = [];
  plataformas = [...PLATAFORMAS];

  searchQuery = '';
  selectedCategoria = '';
  selectedPlataforma = '';
  generoFilter = '';

  loading = false;
  addingToCart: number | null = null;
  cartMessage = '';

  ngOnInit(): void {
    this.loadCategorias();
    this.route.queryParamMap.subscribe(params => {
      this.generoFilter = params.get('genero') ?? '';
      this.selectedCategoria = '';
      this.selectedPlataforma = '';
      this.loadAll();
    });
  }

  loadAll(): void {
    this.loading = true;
    this.videojuegoService.getAll().subscribe({
      next: (data) => {
        this.videojuegos = this.generoFilter
          ? data.filter(g => g.genero === this.generoFilter)
          : data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  loadCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => { this.categorias = data; this.cdr.markForCheck(); },
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (!q) { this.loadAll(); return; }
    this.loading = true;
    this.videojuegoService.buscar(q).subscribe({
      next: (data) => {
        this.videojuegos = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  onCategoriaChange(): void {
    this.selectedPlataforma = '';
    if (!this.selectedCategoria) { this.loadAll(); return; }
    this.loading = true;
    this.videojuegoService.porCategoria(+this.selectedCategoria).subscribe({
      next: (data) => {
        this.videojuegos = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  onPlataformaChange(): void {
    this.selectedCategoria = '';
    if (!this.selectedPlataforma) { this.loadAll(); return; }
    this.loading = true;
    this.videojuegoService.porPlataforma(this.selectedPlataforma).subscribe({
      next: (data) => {
        this.videojuegos = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  agregarAlCarrito(videojuegoId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.addingToCart = videojuegoId;
    this.carritoService.agregar(videojuegoId, 1).subscribe({
      next: () => {
        this.addingToCart = null;
        this.showCartMessage('¡Agregado al carrito!');
      },
      error: () => { this.addingToCart = null; this.cdr.markForCheck(); },
    });
  }

  private showCartMessage(msg: string): void {
    this.cartMessage = msg;
    this.cdr.markForCheck();
    setTimeout(() => { this.cartMessage = ''; this.cdr.markForCheck(); }, 2500);
  }
}
