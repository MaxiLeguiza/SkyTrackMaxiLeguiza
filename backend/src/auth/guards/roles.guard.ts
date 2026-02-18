import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { AuthService } from '../auth.service';
import { UserRole } from 'src/common/enums';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      throw new ForbiddenException('No autenticado o rol no asignado.');
    }

    const hasPermission = requiredRoles.some((role) =>
      user.roles.includes(role),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'No tiene los permisos necesarios para acceder a este recurso.',
      );
    }

    return true;
  }
}
