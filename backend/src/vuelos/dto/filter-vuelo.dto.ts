import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VuelosEstados } from 'generated/prisma/enums';

export class FilterVueloDto {
  @IsOptional()
  @IsString()
  origen?: string;

  @IsOptional()
  @IsString()
  destino?: string;

  @IsOptional()
  @IsEnum(VuelosEstados)
  estado?: VuelosEstados;
}
