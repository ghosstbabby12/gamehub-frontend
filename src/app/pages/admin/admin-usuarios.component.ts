import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { UsuarioAdmin } from '../../models/admin.models';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css',
})
export class AdminUsuariosComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: UsuarioAdmin[] = [];
  filtered: UsuarioAdmin[] = [];
  filtroRol = '';
  searchQuery = '';

  get admins(): UsuarioAdmin[] { return this.filtered.filter(u => u.rol === 'ADMIN'); }
  get clients(): UsuarioAdmin[] { return this.filtered.filter(u => u.rol !== 'ADMIN'); }
  loading = false;
  successMsg = '';
  errorMsg = '';

  editingId: number | null = null;
  editRol = '';

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.adminService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  applyFilter(): void {
    let list = this.filtroRol
      ? this.usuarios.filter((u) => u.rol === this.filtroRol)
      : [...this.usuarios];
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(u =>
        u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    this.filtered = list;
  }

  onSearch(): void {
    this.applyFilter();
  }

  getInitials(nombre: string): string {
    return nombre.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  startEdit(u: UsuarioAdmin): void {
    this.editingId = u.id;
    this.editRol = u.rol;
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.editingId = null;
    this.cdr.markForCheck();
  }

  saveRol(u: UsuarioAdmin): void {
    if (this.editRol === u.rol) { this.cancelEdit(); return; }
    this.adminService.updateRol(u.id, this.editRol).subscribe({
      next: (updated) => {
        const idx = this.usuarios.findIndex(x => x.id === u.id);
        if (idx !== -1) this.usuarios[idx] = updated;
        this.applyFilter();
        this.editingId = null;
        this.showSuccess('Rol actualizado.');
        this.cdr.markForCheck();
      },
      error: () => { this.errorMsg = 'Error al actualizar rol.'; this.cdr.markForCheck(); },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.adminService.deleteUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((u) => u.id !== id);
        this.applyFilter();
        this.showSuccess('Usuario eliminado.');
        this.cdr.markForCheck();
      },
      error: () => { this.errorMsg = 'Error al eliminar usuario.'; this.cdr.markForCheck(); },
    });
  }

  rolClass(rol: string): string {
    return rol === 'ADMIN' ? 'badge-admin' : 'badge-user';
  }

  private showSuccess(msg: string): void {
    this.successMsg = msg;
    this.cdr.markForCheck();
    setTimeout(() => { this.successMsg = ''; this.cdr.markForCheck(); }, 3000);
  }
}
