import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear un nuevo usuario con contraseña hasheada
   */
  async create(createUserDto: CreateUserDto) {
    // Verificar que el usuario no exista
    const existingUser = await this.prisma.user.findUnique({
      where: { nombreusuario: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        nombreusuario: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || UserRole.operador,
      },
    });
  }

  /**
   * Buscar usuario por nombre de usuario
   */
  async findByNombreUsuario(nombreusuario: string) {
    return this.prisma.user.findUnique({
      where: { nombreusuario },
    });
  }
  /**
   * Buscar usuario por ID
   */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nombreusuario: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Actualizar un usuario
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const data: any = {};
    if (updateUserDto.email) data.nombreusuario = updateUserDto.email;
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.role) data.role = updateUserDto.role;

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Eliminar un usuario
   */
  async delete(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
