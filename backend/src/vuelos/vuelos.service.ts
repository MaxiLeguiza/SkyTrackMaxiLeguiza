import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateVuelosDto } from './dto/update-vuelos.dto';
import { CreateVuelosDto } from './dto/create-vuelos.dto';
import { FilterVueloDto } from './dto/filter-vuelo.dto';
import { AvionEstado, VuelosEstados } from '@prisma/client';

@Injectable()
export class VuelosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Función helper para mapear el enum de DTO al enum de Prisma
   */
  private mapEstadoToPrisma(estado: string | undefined): VuelosEstados | undefined {
    if (!estado) return undefined;

    // Normalizar: acepta variantes del front (PROGRAMADO, EN_VUELO) y textos en español
    const normalized = String(estado).toLowerCase().replace(/_/g, ' ').trim();

    switch (normalized) {
      case 'programado':
        return VuelosEstados.programado;
      case 'embarcado':
      case 'embarcando':
        return VuelosEstados.embarcado;
      case 'en vuelo':
      case 'en vuelo':
        return VuelosEstados.en_vuelo;
      case 'aterrizado':
        return VuelosEstados.aterrizado;
      case 'cancelado':
        return VuelosEstados.cancelado;
      default:
        return undefined;
    }
  }

  /**
   * Crear un vuelo
   * Aplica mapeo de estado antes de enviar a Prisma
   */
  create(dto: CreateVuelosDto) {
    const data = { ...dto, estado: this.mapEstadoToPrisma(dto.estado) };
    return this.prisma.vuelos.create({ data });
  }

  /**
   * Listar vuelos con filtros opcionales
   */
  findAll(filters: FilterVueloDto) {
    return this.prisma.vuelos.findMany({
      where: {
        deleted: false,
        ...(filters.origen && { origen: filters.origen }),
        ...(filters.destino && { destino: filters.destino }),
        ...(filters.estado && { estado: this.mapEstadoToPrisma(filters.estado) }),
      },
      include: {
        avion: true,
      },
    });
  }

  /**
   * Obtener un vuelo por ID
   */
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

  /**
   * Actualizar un vuelo
   * Aplica mapeo de estado antes de enviar a Prisma
   */
  update(id: string, dto: UpdateVuelosDto) {
    const data = { ...dto, estado: this.mapEstadoToPrisma(dto.estado) };
    return this.prisma.vuelos.update({
      where: { id },
      data,
    });
  }

  /**
   * Soft delete: marca el vuelo como eliminado
   */
  softDelete(id: string) {
    return this.prisma.vuelos.update({
      where: { id },
      data: { deleted: true },
    });
  }

  /**
   * Cambiar el estado de un vuelo directamente
   */
  async cambiarEstado(id: string, estado: VuelosEstados) {
    // Retornar el vuelo actualizado para que el controlador y los tests puedan
    // verificar el nuevo estado en la respuesta.
    return this.prisma.vuelos.update({
      where: { id },
      data: {
        estado,
      },
    });
  }

  /**
   * Asignar un avión a un vuelo
   * Verifica disponibilidad y actualiza estado del avión
   */
  async asignarAvion(vueloId: string, avionId: string) {
    const avion = await this.prisma.aviones.findUnique({
      where: { id: avionId },
    });

    if (!avion || avion.estado !== AvionEstado.disponible) {
      throw new BadRequestException('El avión no está disponible');
    }

    await this.prisma.aviones.update({
      where: { id: avionId },
      data: { estado: AvionEstado.en_vuelo },
    });

    return this.prisma.vuelos.update({
      where: { id: vueloId },
      data: { avionId },
    });
  }
}
