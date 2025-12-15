import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { VuelosService } from './vuelos.service';
import { CreateVuelosDto } from './dto/create-vuelos.dto';
import { UpdateVuelosDto } from './dto/update-vuelos.dto';
import { FilterVueloDto } from './dto/filter-vuelo.dto';
import { VuelosEstados } from 'generated/prisma/enums';

@Controller('vuelos')
export class VuelosController {
  constructor(private readonly service: VuelosService) {}

  @Post()
  create(@Body() dto: CreateVuelosDto) {
    return this.service.create(dto);
  }

  @Get('/vuelos')
  findAll(@Query() query: FilterVueloDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVuelosDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.softDelete(id);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: VuelosEstados,
  ) {
    return this.service.cambiarEstado(id, estado);
  }

  @Patch(':id/avion/:avionId')
  asignarAvion(@Param('id') id: string, @Param('avionId') avionId: string) {
    return this.service.asignarAvion(id, avionId);
  }
}
