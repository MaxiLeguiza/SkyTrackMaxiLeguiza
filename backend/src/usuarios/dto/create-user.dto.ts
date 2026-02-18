import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

/**
 * DTO para crear un nuevo usuario
 * Valida email único, contraseña mínimo 6 caracteres y rol válido
 */
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsIn([UserRole.admin, UserRole.operador])
  readonly role?: UserRole;
}
