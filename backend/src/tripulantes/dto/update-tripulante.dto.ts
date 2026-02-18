import { PartialType } from '@nestjs/mapped-types';
import { CreateTripulanteDto } from './create-tripulante.dto';

export class UpdateTripulanteDto extends PartialType(CreateTripulanteDto) {}
