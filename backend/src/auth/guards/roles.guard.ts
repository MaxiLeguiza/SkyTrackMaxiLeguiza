import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const { username, password } = request.headers;

    if (!username || !password) {
      throw new ForbiddenException('Credenciales requeridas');
    }

    const user = await this.authService.validateUser(username, password);

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('No tenés permisos');
    }

    request.user = user;
    return true;
  }
}
