import {
  IsEnum,
  IsInt,
  IsString,
  Min,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { AvionEstado } from '@prisma/client';

/**
 * DTO para crear un nuevo avión
 * Valida que el modelo sea texto, capacidad sea número positivo
 * El estado es opcional (por defecto DISPONIBLE)
 */
export class CreateAvionDto {
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsString()
  @IsNotEmpty()
  matricula: string;

  @IsString()
  @IsNotEmpty()
  fabricante: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  capacidad: number;

  @IsEnum(AvionEstado)
  @IsOptional()
  estado?: AvionEstado;
}
