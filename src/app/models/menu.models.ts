export interface MenuOpcion {
  id: number;
  nombre: string;
  icono: string | null;
  ruta: string | null;
  orden: number;
  padreId: number | null;
  hijos: MenuOpcion[];
}
