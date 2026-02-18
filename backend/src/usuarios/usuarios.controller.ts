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
import { UsuariosService } from './usuarios.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../common/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  /**
   * Crear un nuevo usuario (solo administradores)
   */
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usuariosService.create(createUserDto);
  }

  /**
   * Obtener todos los usuarios (solo administradores)
   */
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usuariosService.findAll();
  }

  /**
   * Obtener usuario por ID (solo administradores)
   */
  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findById(id);
  }

  /**
   * Actualizar usuario (solo administradores)
   */
  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usuariosService.update(id, updateUserDto);
  }

  /**
   * Eliminar usuario (solo administradores)
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usuariosService.delete(id);
  }
}
