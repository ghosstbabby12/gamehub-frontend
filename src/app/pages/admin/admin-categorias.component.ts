import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaDTO } from '../../models/videojuego.models';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-categorias.component.html',
  styleUrl: './admin-categorias.component.css',
})
export class AdminCategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private cdr = inject(ChangeDetectorRef);

  categorias: CategoriaDTO[] = [];
  loading = false;
  saving = false;
  showForm = false;
  editingId: number | null = null;

  nombre = '';
  descripcion = '';
  errorMsg = '';
  successMsg = '';

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  showCreate(): void {
    this.editingId = null;
    this.nombre = '';
    this.descripcion = '';
    this.errorMsg = '';
    this.showForm = true;
  }

  showEdit(cat: CategoriaDTO): void {
    this.editingId = cat.id;
    this.nombre = cat.nombre;
    this.descripcion = cat.descripcion;
    this.errorMsg = '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.errorMsg = '';
  }

  save(): void {
    this.saving = true;
    this.errorMsg = '';
    const dto = { nombre: this.nombre, descripcion: this.descripcion };
    const obs =
      this.editingId !== null
        ? this.categoriaService.actualizar(this.editingId, dto)
        : this.categoriaService.crear(dto);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingId = null;
        this.showSuccess('Categoría guardada.');
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
    if (!confirm('¿Eliminar esta categoría?')) return;
    this.categoriaService.eliminar(id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter((c) => c.id !== id);
        this.showSuccess('Categoría eliminada.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMsg = (err.error?.message as string) ?? 'Error al eliminar.';
        this.cdr.markForCheck();
      },
    });
  }

  private showSuccess(msg: string): void {
    this.successMsg = msg;
    this.cdr.markForCheck();
    setTimeout(() => { this.successMsg = ''; this.cdr.markForCheck(); }, 3000);
  }
}
