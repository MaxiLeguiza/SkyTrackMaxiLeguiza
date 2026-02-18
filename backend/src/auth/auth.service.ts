import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtAuthService,
  ) {}
  async validateUser(email: string, pass: string) {
    const user = await this.usuariosService.findByNombreUsuario(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.nombreusuario,
      sub: user.id,
      roles: [user.role],
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
