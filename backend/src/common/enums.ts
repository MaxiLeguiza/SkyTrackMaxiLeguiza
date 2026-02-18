/**
 * Enums compartidos de la aplicación
 * Se definen localmente porque Prisma 5 puede tener problemas al importarlos
 */

export enum UserRole {
  ADMIN = 'admin',
  OPERADOR = 'operador',
  USUARIO = 'usuario',
}

export enum VuelosEstados {
  PROGRAMADO = 'programado',
  EMBARCANDO = 'embarcando',
  EN_VUELO = 'en_vuelo',
  ATERRIZADO = 'aterrizado',
  CANCELADO = 'cancelado',
}

/*
export enum AvionEstado {
  DISPONIBLE = 'disponible',
  EN_VUELO = 'en_vuelo',
  EN_MANTENIMIENTO = 'en_mantenimiento',
}*/
