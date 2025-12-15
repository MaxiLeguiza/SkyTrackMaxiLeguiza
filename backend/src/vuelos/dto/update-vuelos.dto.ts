import { PartialType } from '@nestjs/mapped-types';
import { CreateVuelosDto } from './create-vuelos.dto';

export class UpdateVuelosDto extends PartialType(CreateVuelosDto) {}
