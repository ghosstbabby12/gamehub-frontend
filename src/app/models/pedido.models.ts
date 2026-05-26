export interface ItemPedidoDTO {
  id: number;
  videojuegoId: number;
  videojuegoTitulo: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoDTO {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  clienteNombre: string;
  clienteCorreo: string;
  items: ItemPedidoDTO[];
}
