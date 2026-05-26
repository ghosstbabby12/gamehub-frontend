import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { VideojuegoService } from '../../services/videojuego.service';
import { CategoriaService } from '../../services/categoria.service';
import { VideojuegoDTO, VideojuegoCreateDTO, CategoriaDTO, PLATAFORMAS, GENEROS } from '../../models/videojuego.models';

@Component({
  selector: 'app-admin-videojuegos',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, CurrencyPipe],
  templateUrl: './admin-videojuegos.component.html',
  styleUrl: './admin-videojuegos.component.css',
})
export class AdminVideojuegosComponent implements OnInit {
  private videojuegoService = inject(VideojuegoService);
  private categoriaService = inject(CategoriaService);
  private cdr = inject(ChangeDetectorRef);

  videojuegos: VideojuegoDTO[] = [];
  categorias: CategoriaDTO[] = [];
  plataformas = [...PLATAFORMAS];
  generos = [...GENEROS];

  loading = false;
  saving = false;
  showForm = false;
  editingId: number | null = null;

  formModel: VideojuegoCreateDTO = this.emptyForm();
  errorMsg = '';
  successMsg = '';

  ngOnInit(): void {
    this.loadAll();
    this.loadCategorias();
  }

  loadAll(): void {
    this.loading = true;
    this.videojuegoService.getAll().subscribe({
      next: (data) => {
        this.videojuegos = data;
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

  showCreate(): void {
    this.editingId = null;
    this.formModel = this.emptyForm();
    this.errorMsg = '';
    this.showForm = true;
  }

  showEdit(game: VideojuegoDTO): void {
    this.editingId = game.id;
    this.formModel = {
      titulo: game.titulo,
      descripcion: game.descripcion,
      precio: game.precio,
      stock: game.stock,
      plataforma: game.plataforma,
      imagenUrl: game.imagenUrl,
      fechaLanzamiento: game.fechaLanzamiento,
      genero: game.genero,
      categoriaId: game.categoriaId,
    };
    this.errorMsg = '';
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.errorMsg = '';
  }

  save(): void {
    this.saving = true;
    this.errorMsg = '';
    const obs =
      this.editingId !== null
        ? this.videojuegoService.actualizar(this.editingId, this.formModel)
        : this.videojuegoService.crear(this.formModel);

    obs.subscribe({
      next: () => {
        this.saving = false;
        const wasEditing = this.editingId !== null;
        this.showForm = false;
        this.editingId = null;
        this.showSuccess(wasEditing ? 'Videojuego actualizado.' : 'Videojuego creado.');
        this.loadAll();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = (err.error?.message as string) ?? 'Error al guardar.';
        this.cdr.markForCheck();
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este videojuego?')) return;
    this.videojuegoService.eliminar(id).subscribe({
      next: () => {
        this.videojuegos = this.videojuegos.filter((v) => v.id !== id);
        this.showSuccess('Videojuego eliminado.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMsg = (err.error?.message as string) ?? 'Error al eliminar.';
        this.cdr.markForCheck();
      },
    });
  }

  private emptyForm(): VideojuegoCreateDTO {
    return {
      titulo: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      plataforma: '',
      imagenUrl: '',
      fechaLanzamiento: '',
      genero: '',
      categoriaId: 0,
    };
  }

  private showSuccess(msg: string): void {
    this.successMsg = msg;
    this.cdr.markForCheck();
    setTimeout(() => { this.successMsg = ''; this.cdr.markForCheck(); }, 3000);
  }
}
