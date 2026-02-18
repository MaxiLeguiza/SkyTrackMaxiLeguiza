import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

/**
 * DTO para crear un nuevo tripulante
 * Valida que nombre y rol sean strings no vacíos
 * El rol puede ser: PILOTO, COPILOTO, ASISTENTE_VUELO, TÉCNICO
 */
export class CreateTripulanteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsBoolean()
  @IsOptional()
  disponible: boolean;

  @IsString()
  @IsNotEmpty()
  licencia: string;

  @IsString()
  @IsNotEmpty()
  rol: string;
}
