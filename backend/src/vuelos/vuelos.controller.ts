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
  UseGuards,
} from '@nestjs/common';
import { VuelosService } from './vuelos.service';
import { CreateVuelosDto } from './dto/create-vuelos.dto';
import { UpdateVuelosDto } from './dto/update-vuelos.dto';
import { FilterVueloDto } from './dto/filter-vuelo.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../common/enums';
import { VuelosEstados } from '@prisma/client';

/**
 * Controller de Vuelos
 * Gestiona la creación, lectura, actualización y eliminación de vuelos
 * Incluye filtrado por origen, destino y estado
 * Permite asignar aviones y cambiar estado del vuelo
 */
@Controller('flights')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VuelosController {
  constructor(private readonly service: VuelosService) {}

  /**
   * Crear un nuevo vuelo
   * @param dto - Datos del vuelo (origen, destino, estado)
   * @returns Vuelo creado
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  create(@Body() dto: CreateVuelosDto) {
    return this.service.create(dto);
  }

  /**
   * Listar todos los vuelos con filtros opcionales
   * @param query - Filtros (origen, destino, estado)
   * @returns Lista de vuelos que coinciden con los filtros
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  findAll(@Query() query: FilterVueloDto) {
    return this.service.findAll(query);
  }

  /**
   * Obtener un vuelo por ID
   * @param id - ID del vuelo
   * @returns Vuelo con sus detalles
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Actualizar un vuelo
   * @param id - ID del vuelo
   * @param dto - Datos a actualizar
   * @returns Vuelo actualizado
   */
  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  update(@Param('id') id: string, @Body() dto: UpdateVuelosDto) {
    return this.service.update(id, dto);
  }

  /**
   * Eliminar un vuelo (soft delete)
   * Solo administradores
   * @param id - ID del vuelo
   * @returns Vuelo eliminado
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.softDelete(id);
  }

  /**
   * Cambiar el estado de un vuelo
   * @param id - ID del vuelo
   * @param status - Nuevo estado
   * @returns Vuelo con estado actualizado
   */
  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  changeStatus(@Param('id') id: string, @Body('status') status: VuelosEstados) {
    return this.service.cambiarEstado(id, status);
  }

  /**
   * Asignar un avión a un vuelo
   * @param id - ID del vuelo
   * @param avionId - ID del avión
   * @returns Vuelo con avión asignado
   */
  @Patch(':id/avion/:avionId')
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  asignarAvion(@Param('id') id: string, @Param('avionId') avionId: string) {
    return this.service.asignarAvion(id, avionId);
  }

  /**
   * Asignar tripulante a un vuelo
   * @param id - ID del vuelo
   * @param crewMemberId - ID del tripulante
   */
  @Post(':id/crew')
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  assignCrew(
    @Param('id') id: string,
    @Body('crewMemberId') crewMemberId: string,
  ) {
    // Nota: Asegúrate de tener el método 'asignarTripulacion' en tu VuelosService
    return (this.service as any).asignarTripulacion(id, crewMemberId);
  }

  /**
   * Quitar tripulante de un vuelo
   * @param id - ID del vuelo
   * @param crewMemberId - ID del tripulante
   */
  @Delete(':id/crew/:crewMemberId')
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  removeCrew(
    @Param('id') id: string,
    @Param('crewMemberId') crewMemberId: string,
  ) {
    // Nota: Asegúrate de tener el método 'removerTripulacion' en tu VuelosService
    return (this.service as any).removerTripulacion(id, crewMemberId);
  }
}
