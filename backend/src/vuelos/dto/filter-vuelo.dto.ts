import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VuelosEstadosEnum } from './create-vuelos.dto';

/**
 * DTO para filtrar vuelos
 * Todos los campos son opcionales
 * Permite filtrar por origen, destino y/o estado
 */
export class FilterVueloDto {
  @IsOptional()
  @IsString()
  origen?: string;

  @IsOptional()
  @IsString()
  destino?: string;

  @IsOptional()
  @IsEnum(VuelosEstadosEnum)
  estado?: VuelosEstadosEnum;
}
