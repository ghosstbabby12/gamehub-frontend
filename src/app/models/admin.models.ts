export interface AdminDTO {
  id: number;
  nombre: string;
  email: string;
  cargo: string;
}

export interface ClienteDTO {
  id: number;
  nombre: string;
  email: string;
}

export interface UsuarioAdmin {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}
