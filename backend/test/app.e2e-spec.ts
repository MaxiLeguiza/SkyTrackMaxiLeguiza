import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { VuelosEstados } from '../src/common/enums';

describe('SkyTrack Airlines - E2E Tests', () => {
  let app: INestApplication;
  let vueloId: string;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Autenticar como admin para usar endpoints protegidos
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });

    token = loginRes.body?.access_token;
    expect(typeof token).toBe('string');
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Caso 1 - Listado de Vuelos + Filtros', () => {
    it('GET /vuelos - Debe retornar listado de vuelos', () => {
      return request(app.getHttpServer())
        .get('/flights')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /vuelos?estado=PROGRAMADO - Debe filtrar vuelos por estado', () => {
      return request(app.getHttpServer())
        .get('/flights')
        .set('Authorization', `Bearer ${token}`)
        .query({ estado: VuelosEstados.PROGRAMADO })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((vuelo: any) => {
              expect(vuelo.estado).toBe(VuelosEstados.PROGRAMADO);
            });
          }
        });
    });

    it('GET /vuelos?origen=Madrid - Debe filtrar vuelos por origen', () => {
      return request(app.getHttpServer())
        .get('/flights')
        .set('Authorization', `Bearer ${token}`)
        .query({ origen: 'Madrid' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((vuelo: any) => {
              expect(vuelo.origen).toBe('Madrid');
            });
          }
        });
    });

    it('GET /vuelos?destino=Barcelona - Debe filtrar vuelos por destino', () => {
      return request(app.getHttpServer())
        .get('/flights')
        .set('Authorization', `Bearer ${token}`)
        .query({ destino: 'Barcelona' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((vuelo: any) => {
              expect(vuelo.destino).toBe('Barcelona');
            });
          }
        });
    });
  });

  describe('Caso 3 - Crear y Editar Vuelos', () => {
    it('POST /vuelos - Debe crear un nuevo vuelo', () => {
      const createVueloDto = {
        origen: 'Madrid',
        destino: 'Barcelona',
        estado: VuelosEstados.PROGRAMADO,
      };

      return request(app.getHttpServer())
        .post('/flights')
        .set('Authorization', `Bearer ${token}`)
        .send(createVueloDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.origen).toBe('Madrid');
          expect(res.body.destino).toBe('Barcelona');
          expect(res.body.estado).toBe(VuelosEstados.PROGRAMADO);
          vueloId = res.body.id;
        });
    });

    it('GET /vuelos/:id - Debe obtener un vuelo específico', () => {
      return request(app.getHttpServer())
        .get(`/flights/${vueloId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', vueloId);
          expect(res.body).toHaveProperty('tripulacionAsignada');
        });
    });

    it('PUT /vuelos/:id - Debe editar un vuelo existente', () => {
      const updateVueloDto = {
        estado: VuelosEstados.EN_VUELO,
      };

      return request(app.getHttpServer())
        .put(`/flights/${vueloId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateVueloDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.estado).toBe(VuelosEstados.EN_VUELO);
        });
    });

    it('PATCH /vuelos/:id/estado - Debe cambiar el estado del vuelo', () => {
      return request(app.getHttpServer())
        .patch(`/flights/${vueloId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: VuelosEstados.ATERRIZADO })
        .expect(200)
        .expect((res) => {
          expect(res.body.estado).toBe(VuelosEstados.ATERRIZADO);
        });
    });
  });

  describe('Caso 4 - Gestión de Aviones', () => {
    let avionId: string;

    it('POST /aviones - Debe crear un avión', () => {
      const createAvionDto = {
        modelo: 'Boeing 747',
        matricula: 'TEST-123',
        fabricante: 'Boeing Inc',
        capacidad: 400,
      };

      return request(app.getHttpServer())
        .post('/aviones')
        .set('Authorization', `Bearer ${token}`)
        .send(createAvionDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.modelo).toBe('Boeing 747');
          expect(res.body.capacidad).toBe(400);
          avionId = res.body.id;
        });
    });

    it('GET /aviones - Debe listar todos los aviones', () => {
      return request(app.getHttpServer())
        .get('/aviones')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /aviones/:id - Debe obtener un avión específico', () => {
      return request(app.getHttpServer())
        .get(`/aviones/${avionId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', avionId);
        });
    });

    it('PUT /aviones/:id - Debe actualizar avión', () => {
      const updateAvionDto = {
        modelo: 'Airbus A380',
      };

      return request(app.getHttpServer())
        .put(`/aviones/${avionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateAvionDto)
        .expect(200);
    });
  });

  describe('Caso 5 - Gestión de Tripulación', () => {
    let tripulanteId: string;

    it('POST /tripulantes - Debe crear un tripulante', () => {
      const createTripulanteDto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        licencia: 'LIC-123',
        rol: 'Piloto',
        disponible: true,
      };

      return request(app.getHttpServer())
        .post('/tripulantes')
        .set('Authorization', `Bearer ${token}`)
        .send(createTripulanteDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.nombre).toBe('Juan');
          tripulanteId = res.body.id;
        });
    });

    it('GET /tripulantes - Debe listar tripulantes', () => {
      return request(app.getHttpServer())
        .get('/tripulantes')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('POST /vuelos/:vueloId/tripulantes/:tripulanteId - Debe asignar tripulante a vuelo', () => {
      return request(app.getHttpServer())
        .post(`/vuelos/${vueloId}/tripulantes/${tripulanteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('vueloId', vueloId);
          expect(res.body).toHaveProperty('tripulanteId', tripulanteId);
        });
    });

    it('GET /vuelos/:vueloId/tripulantes - Debe listar tripulantes del vuelo', () => {
      return request(app.getHttpServer())
        .get(`/vuelos/${vueloId}/tripulantes`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('DELETE /vuelos/:vueloId/tripulantes/:tripulanteId - Debe quitar tripulante del vuelo', () => {
      return request(app.getHttpServer())
        .delete(`/vuelos/${vueloId}/tripulantes/${tripulanteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Caso 2 - Baja Lógica de Vuelos', () => {
    it('DELETE /vuelos/:id - Debe realizar soft delete de vuelo (solo ADMIN)', () => {
      return request(app.getHttpServer())
        .delete(`/flights/${vueloId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.deleted).toBe(true);
        });
    });
  });

  describe('Autenticación y Autorización', () => {
    it('POST /auth/login - Debe retornar token JWT', () => {
        const loginDto = {
        email: 'admin@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(typeof res.body.access_token).toBe('string');
        });
    });
  });
});
