import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO para el login de usuarios
 * Valida que el email sea un email válido y la contraseña tenga mínimo 6 caracteres
 */
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
