import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <app-navbar />
    <div class="app-layout">
      @if (!isAdminRoute()) {
        <app-sidebar />
      }
      <main class="app-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: calc(100vh - 64px);
    }
    .app-content {
      flex: 1;
      min-width: 0;
      overflow-x: hidden;
    }
  `],
})
export class App {
  private router = inject(Router);

  isAdminRoute = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects.startsWith('/admin')),
      startWith(this.router.url.startsWith('/admin'))
    ),
    { initialValue: this.router.url.startsWith('/admin') }
  );
}
