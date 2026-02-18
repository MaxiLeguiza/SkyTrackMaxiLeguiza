import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAvionDto } from './dto/create-avion.dto';
import { UpdateAvionDto } from './dto/update-avion.dto';
//import { AvionEstado } from '../common/enums';
import { AvionEstado } from '@prisma/client';

@Injectable()
export class AvionesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAvionDto) {
    return this.prisma.aviones.create({
      data: {
        ...dto,
        estado: dto.estado ?? AvionEstado.disponible,
      },
    });
  }

  findAll() {
    return this.prisma.aviones.findMany({
      where: { deleted: false },
    });
  }

  findOne(id: string) {
    return this.prisma.aviones.findFirst({
      where: { id, deleted: false },
    });
  }

  update(id: string, dto: UpdateAvionDto) {
    return this.prisma.aviones.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Soft delete: marca el avión como eliminado en lugar de borrarlo
   */
  softDelete(id: string) {
    return this.prisma.aviones.update({
      where: { id },
      data: { deleted: true },
    });
  }

  /**
   * Hard delete: elimina completamente el registro (solo si es necesario)
   */
  hardDelete(id: string) {
    return this.prisma.aviones.delete({ where: { id } });
  }

  async validarDisponibilidad(avionId: string) {
    const avion = await this.findOne(avionId);

    if (!avion || avion.estado !== AvionEstado.disponible) {
      throw new BadRequestException('El avión no está disponible');
    }

    return avion;
  }
}
