export enum EstadoVuelo {
  PROGRAMADO = 'PROGRAMADO',
  EN_RUTA = 'EN_RUTA',
  ATERRIZADO = 'ATERRIZADO',
  CANCELADO = 'CANCELADO',
}
// Modelamos el dominio sin DB (ideal para tests y aprendizaje)
export interface Vuelos {
  id: number;
  codigo: string;
  origen: string;
  destino: string;
  estado: EstadoVuelo;
  isDeleted: boolean;
}

export interface VuelosFiltros {
  origen?: string;
  destino?: string;
  estado?: EstadoVuelo;
}
