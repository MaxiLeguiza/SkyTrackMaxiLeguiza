import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVuelosDto } from './dto/create-vuelos.dto';
import { UpdateVuelosDto } from './dto/update-vuelos.dto';
import { FilterVueloDto } from './dto/filter-vuelo.dto';
import { VuelosEstados, AvionEstado } from 'generated/prisma/enums';

@Injectable()
export class VuelosService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateVuelosDto) {
    return this.prisma.vuelos.create({ data: dto });
  }

  findAll(filters: FilterVueloDto) {
    return this.prisma.vuelos.findMany({
      where: {
        deleted: false,
        ...(filters.origen && { origen: filters.origen }),
        ...(filters.destino && { destino: filters.destino }),
        ...(filters.estado && { estado: filters.estado }),
      },
      include: {
        avion: true,
      },
    });
  }

  async findOne(id: string) {
    const vuelo = await this.prisma.vuelos.findFirst({
      where: { id, deleted: false },
      include: {
        avion: true,
        tripulacionAsignada: {
          include: {
            tripulante: true,
          },
        },
      },
    });

    if (!vuelo) {
      throw new NotFoundException('Vuelo no encontrado');
    }

    return vuelo;
  }

  update(id: string, dto: UpdateVuelosDto) {
    return this.prisma.vuelos.update({
      where: { id },
      data: dto,
    });
  }

  softDelete(id: string) {
    return this.prisma.vuelos.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async cambiarEstado(id: string, estado: VuelosEstados) {
    return this.prisma.vuelos.update({
      where: { id },
      data: { estado },
    });
  }

  async asignarAvion(vueloId: string, avionId: string) {
    const avion = await this.prisma.aviones.findUnique({
      where: { id: avionId },
    });

    if (!avion || avion.estado !== AvionEstado.DISPONIBLE) {
      throw new BadRequestException('El avión no está disponible');
    }

    await this.prisma.aviones.update({
      where: { id: avionId },
      data: { estado: AvionEstado.EN_VUELO },
    });

    return this.prisma.vuelos.update({
      where: { id: vueloId },
      data: { avionId },
    });
  }
}
