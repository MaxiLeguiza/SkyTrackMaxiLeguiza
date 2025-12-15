import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TripulantesService } from './tripulantes.service';
import { CreateTripulanteDto } from './dto/create-tripulante.dto';

@Controller('tripulantes')
export class TripulantesController {
  constructor(private service: TripulantesService) {}

  @Post()
  create(@Body() dto: CreateTripulanteDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
