import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TripulantesService } from './tripulantes.service';
import { CreateTripulanteDto } from './dto/create-tripulante.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../common/enums';
import { UpdateTripulanteDto } from './dto/update-tripulante.dto';

@Controller('tripulantes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TripulantesController {
  constructor(private service: TripulantesService) {}

  /**
   * Crear un nuevo tripulante (solo administradores)
   */
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateTripulanteDto) {
    return this.service.create(dto);
  }

  /**
   * Obtener todos los tripulantes (cualquier usuario autenticado)
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  findAll() {
    return this.service.findAll();
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  update(@Param('id') id: string, @Body() dto: UpdateTripulanteDto) {
    return this.service.update(id, dto);
  }

  /**
   * Eliminar un tripulante (solo administradores)
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
