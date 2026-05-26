import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MenuOpcion } from '../../models/menu.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  private menuService = inject(MenuService);

  menu = signal<MenuOpcion[]>([]);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.menuService.getMenu().subscribe({
      next: (data) => {
        this.menu.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
