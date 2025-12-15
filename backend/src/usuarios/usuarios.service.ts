import { Injectable } from '@nestjs/common';

export interface Usuario {
  id: number;
  email: string;
  password: string;
  roles: string[];
}

@Injectable()
export class UsuariosService {
  private usuarios: Usuario[] = [
    {
      id: 1,
      email: 'test@example.com',
      password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvQOm',
      roles: ['user'],
    },
  ];

  findByEmail(email: string): Usuario | null {
    return this.usuarios.find((u) => u.email === email) || null;
  }

  findById(id: number): Usuario | null {
    return this.usuarios.find((u) => u.id === id) || null;
  }
}
