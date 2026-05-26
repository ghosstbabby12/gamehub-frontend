export interface CategoriaDTO {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface VideojuegoDTO {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  stock: number;
  plataforma: string;
  imagenUrl: string;
  fechaLanzamiento: string;
  genero: string;
  categoriaId: number;
  categoriaNombre: string;
  disponible: boolean;
}

export interface VideojuegoCreateDTO {
  titulo: string;
  descripcion: string;
  precio: number;
  stock: number;
  plataforma: string;
  imagenUrl: string;
  fechaLanzamiento: string;
  genero: string;
  categoriaId: number;
}

export const PLATAFORMAS = ['PS5', 'XBOX', 'PC', 'SWITCH', 'MOBILE'] as const;
export const GENEROS = ['ACCION', 'RPG', 'DEPORTES', 'ESTRATEGIA'] as const;
