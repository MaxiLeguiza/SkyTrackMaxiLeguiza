import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VuelosTripulantesService } from './vuelos-tripulantes.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../common/enums';

@Controller('vuelos/:vueloId/tripulantes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VuelosTripulantesController {
  constructor(private readonly service: VuelosTripulantesService) {}

  /**
   * Asignar un tripulante a un vuelo
   * Solo operadores y administradores pueden hacerlo
   */
  @Post(':tripulanteId')
  @Roles(UserRole.OPERADOR, UserRole.ADMIN)
  asignarTripulante(
    @Param('vueloId') vueloId: string,
    @Param('tripulanteId') tripulanteId: string,
  ) {
    return this.service.asignarTripulante(vueloId, tripulanteId);
  }

  /**
   * Quitar un tripulante de un vuelo
   * Solo operadores y administradores pueden hacerlo
   */
  @Delete(':tripulanteId')
  @Roles(UserRole.OPERADOR, UserRole.ADMIN)
  quitarTripulante(
    @Param('vueloId') vueloId: string,
    @Param('tripulanteId') tripulanteId: string,
  ) {
    return this.service.quitarTripulante(vueloId, tripulanteId);
  }

  /**
   * Listar todos los tripulantes asignados a un vuelo
   * Cualquier usuario autenticado puede verlo
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  listarTripulantesPorVuelo(@Param('vueloId') vueloId: string) {
    return this.service.listarTripulantesPorVuelo(vueloId);
  }
}
