import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTripulanteDto } from './dto/create-tripulante.dto';

@Injectable()
export class TripulantesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTripulanteDto) {
    return this.prisma.tripulantes.create({ data: dto });
  }

  findAll() {
    return this.prisma.tripulantes.findMany();
  }

  findOne(id: string) {
    return this.prisma.tripulantes.findUnique({ where: { id } });
  }

  delete(id: string) {
    return this.prisma.tripulantes.delete({ where: { id } });
  }
}
