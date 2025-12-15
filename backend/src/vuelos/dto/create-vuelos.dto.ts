import { IsString, IsEnum } from 'class-validator';
import { VuelosEstados } from 'generated/prisma/enums';

export class CreateVuelosDto {
  @IsString()
  codigo?: string;

  @IsString()
  origen: string;

  @IsString()
  destino: string;

  @IsEnum(VuelosEstados)
  estado: VuelosEstados;
}
