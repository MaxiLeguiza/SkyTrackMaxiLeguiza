import { IsEnum, IsInt, IsString, Min } from 'class-validator';
import { AvionEstado } from 'generated/prisma/enums';

export class CreateAvionDto {
  @IsString()
  modelo: string;

  @IsInt()
  @Min(1)
  capacidad: number;

  @IsEnum(AvionEstado)
  estado: AvionEstado;
}
