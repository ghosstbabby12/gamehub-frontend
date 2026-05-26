export interface ItemCarritoDTO {
  id: number;
  videojuegoId: number;
  videojuegoTitulo: string;
  imagenUrl: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CarritoDTO {
  id: number;
  usuarioEmail: string;
  fechaActualizacion: string;
  items: ItemCarritoDTO[];
  total: number;
}
