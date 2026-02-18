import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AvionesService } from './aviones.service';
import { CreateAvionDto } from './dto/create-avion.dto';
import { UpdateAvionDto } from './dto/update-avion.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../common/enums';

@Controller('aviones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvionesController {
  constructor(private readonly service: AvionesService) {}

  /**
   * Crear un nuevo avión (solo administradores)
   */
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateAvionDto) {
    return this.service.create(dto);
  }

  /**
   * Obtener todos los aviones (cualquier usuario autenticado)
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  findAll() {
    return this.service.findAll();
  }

  /**
   * Obtener avión por ID (cualquier usuario autenticado)
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERADOR)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Actualizar un avión (solo administradores)
   */
  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateAvionDto) {
    return this.service.update(id, dto);
  }

  /**
   * Eliminar un avión (solo administradores)
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
