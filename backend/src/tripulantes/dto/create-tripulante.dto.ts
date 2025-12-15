import { IsString } from 'class-validator';

export class CreateTripulanteDto {
  @IsString()
  nombre: string;

  @IsString()
  rol: string;
}
