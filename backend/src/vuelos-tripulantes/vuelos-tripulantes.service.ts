import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VuelosTripulantesService {
  constructor(private prisma: PrismaService) {}

  async asignarTripulante(vueloId: string, tripulanteId: string) {
    return this.prisma.vuelosTripulantes.create({
      data: {
        vueloId,
        tripulanteId,
      },
    });
  }

  async quitarTripulante(vueloId: string, tripulanteId: string) {
    const asignacion = await this.prisma.vuelosTripulantes.findFirst({
      where: { vueloId, tripulanteId },
    });

    if (!asignacion) {
      throw new BadRequestException(
        'El tripulante no se encuentra registrado en este vuelo',
      );
    }

    return this.prisma.vuelosTripulantes.delete({
      where: { id: asignacion.id },
    });
  }

  async listarTripulantesPorVuelo(vueloId: string) {
    return this.prisma.vuelosTripulantes.findMany({
      where: { vueloId },
      include: {
        tripulante: true,
      },
    });
  }
}
