import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuOpcion } from '../../models/menu.models';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MenuItemComponent],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',
})
export class MenuItemComponent {
  @Input() item!: MenuOpcion;

  open = signal(false);

  get hasChildren(): boolean {
    return this.item.hijos && this.item.hijos.length > 0;
  }

  get routePath(): string {
    return this.item.ruta?.split('?')[0] ?? '';
  }

  get queryParams(): Record<string, string> {
    const qs = this.item.ruta?.split('?')[1];
    if (!qs) return {};
    return Object.fromEntries(new URLSearchParams(qs).entries());
  }

  toggle(): void {
    if (this.hasChildren) this.open.update(v => !v);
  }
}
