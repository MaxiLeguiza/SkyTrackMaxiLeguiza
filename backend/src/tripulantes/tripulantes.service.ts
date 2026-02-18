import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTripulanteDto } from './dto/create-tripulante.dto';
import { UpdateTripulanteDto } from './dto/update-tripulante.dto';

@Injectable()
export class TripulantesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTripulanteDto) {
    return this.prisma.tripulantes.create({ data: dto });
  }

  findAll() {
    return this.prisma.tripulantes.findMany({
      where: { deleted: false },
    });
  }

  findOne(id: string) {
    return this.prisma.tripulantes.findFirst({
      where: { id, deleted: false },
    });
  }

  /**
   * Soft delete: marca el tripulante como eliminado en lugar de borrarlo
   */
  softDelete(id: string) {
    return this.prisma.tripulantes.update({
      where: { id },
      data: { deleted: true },
    });
  }

  update(id: string, dto: UpdateTripulanteDto) {
return this.prisma.tripulantes.update({ where: { id }, data: dto });}

  /**
   * Hard delete: elimina completamente el registro (solo si es necesario)
   */
  hardDelete(id: string) {
    return this.prisma.tripulantes.delete({ where: { id } });
  }
}
