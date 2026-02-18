import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

// Definir el enum localmente si no se importa correctamente de Prisma
export enum VuelosEstadosEnum {
  PROGRAMADO = 'PROGRAMADO',
  EMBARCADO = 'EMBARCADO',
  EN_VUELO = 'EN_VUELO',
  ATERRIZADO = 'ATERRIZADO',
  CANCELADO = 'CANCELADO',
}

/**
 * DTO para crear un nuevo vuelo
 * Valida que origen y destino sean strings, y estado sea uno de los estados válidos
 * Estados válidos: PROGRAMADO, EMBARCADO, EN_VUELO, ATERRIZADO, CANCELADO
 */
export class CreateVuelosDto {
  @IsString()
  @IsNotEmpty()
  origen: string;

  @IsString()
  @IsNotEmpty()
  destino: string;

  @IsEnum(VuelosEstadosEnum)
  @IsNotEmpty()
  estado: VuelosEstadosEnum;

  @IsString()
  @IsOptional()
  numeroVuelo?: string;

  @IsString()
  @IsOptional()
  fechaSalida?: string; // "YYYY-MM-DD"

  @IsString()
  @IsOptional()
  horaSalida?: string;  // "HH:MM"

  @IsString()
  @IsOptional()
  fechaLlegada?: string;

  @IsString()
  @IsOptional()
  horaLlegada?: string;
}
