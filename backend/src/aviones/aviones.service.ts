import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvionDto } from './dto/create-avion.dto';
import { UpdateAvionDto } from './dto/update-avion.dto';
import { AvionEstado } from 'generated/prisma/enums';

@Injectable()
export class AvionesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAvionDto) {
    return this.prisma.aviones.create({ data: dto });
  }

  findAll() {
    return this.prisma.aviones.findMany();
  }

  findOne(id: string) {
    return this.prisma.aviones.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateAvionDto) {
    return this.prisma.aviones.update({
      where: { id },
      data: dto,
    });
  }

  delete(id: string) {
    return this.prisma.aviones.delete({ where: { id } });
  }

  async validarDisponibilidad(avionId: string) {
    const avion = await this.findOne(avionId);

    if (!avion || avion.estado !== AvionEstado.DISPONIBLE) {
      throw new BadRequestException('El avión no está disponible');
    }

    return avion;
  }
}
