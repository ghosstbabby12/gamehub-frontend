import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/tienda', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'tienda',
    loadComponent: () =>
      import('./pages/tienda/tienda.component').then((m) => m.TiendaComponent),
  },
  {
    path: 'tienda/:id',
    loadComponent: () =>
      import('./pages/tienda/tienda-detalle.component').then((m) => m.TiendaDetalleComponent),
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.component').then((m) => m.PerfilComponent),
    canActivate: [authGuard],
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/carrito/carrito.component').then((m) => m.CarritoComponent),
    canActivate: [authGuard],
  },
  {
    path: 'mis-pedidos',
    loadComponent: () =>
      import('./pages/mis-pedidos/mis-pedidos.component').then((m) => m.MisPedidosComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'admin/videojuegos',
    loadComponent: () =>
      import('./pages/admin/admin-videojuegos.component').then(
        (m) => m.AdminVideojuegosComponent
      ),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'admin/categorias',
    loadComponent: () =>
      import('./pages/admin/admin-categorias.component').then(
        (m) => m.AdminCategoriasComponent
      ),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'admin/pedidos',
    loadComponent: () =>
      import('./pages/admin/admin-pedidos.component').then((m) => m.AdminPedidosComponent),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'admin/usuarios',
    loadComponent: () =>
      import('./pages/admin/admin-usuarios.component').then((m) => m.AdminUsuariosComponent),
    canActivate: [authGuard, roleGuard],
  },
];
