import { Test, TestingModule } from '@nestjs/testing';
import { VuelosService } from './vuelos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { VuelosEstadosEnum } from './dto/create-vuelos.dto';

describe('VuelosService - Filtrado', () => {
  let service: VuelosService;
  let prismaService: PrismaService;

  const mockVuelos = [
    {
      id: '1',
      origen: 'Madrid',
      destino: 'Barcelona',
      estado: VuelosEstadosEnum.PROGRAMADO,
      deleted: false,
      avionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      origen: 'Madrid',
      destino: 'Valencia',
      estado: VuelosEstadosEnum.EN_VUELO,
      deleted: false,
      avionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      origen: 'Barcelona',
      destino: 'Malaga',
      estado: VuelosEstadosEnum.ATERRIZADO,
      deleted: false,
      avionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      origen: 'Madrid',
      destino: 'Sevilla',
      estado: VuelosEstadosEnum.CANCELADO,
      deleted: true,
      avionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const mockPrismaService = {
      vuelos: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VuelosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VuelosService>(VuelosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll - Filtrado de vuelos', () => {
    it('Debe retornar todos los vuelos no eliminados', async () => {
      const expectedResult = mockVuelos.filter((v) => !v.deleted);
      (prismaService.vuelos.findMany as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.findAll({});

      expect(result).toEqual(expectedResult);
      expect(result).toHaveLength(3);
    });

    it('Debe filtrar vuelos por estado correctamente', async () => {
      const expectedResult = mockVuelos.filter(
        (v) => v.estado === VuelosEstadosEnum.PROGRAMADO && !v.deleted,
      );
      (prismaService.vuelos.findMany as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.findAll({ estado: VuelosEstadosEnum.PROGRAMADO });

      expect(result).toEqual(expectedResult);
      expect(result[0].estado).toBe(VuelosEstadosEnum.PROGRAMADO);
    });

    it('Debe filtrar vuelos por origen correctamente', async () => {
      const expectedResult = mockVuelos.filter(
        (v) => v.origen === 'Madrid' && !v.deleted,
      );
      (prismaService.vuelos.findMany as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.findAll({ origen: 'Madrid' });

      expect(result).toEqual(expectedResult);
      expect(result.every((v) => v.origen === 'Madrid')).toBe(true);
    });

    it('Debe filtrar vuelos por destino correctamente', async () => {
      const expectedResult = mockVuelos.filter(
        (v) => v.destino === 'Barcelona' && !v.deleted,
      );
      (prismaService.vuelos.findMany as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.findAll({ destino: 'Barcelona' });

      expect(result).toEqual(expectedResult);
      expect(result.every((v) => v.destino === 'Barcelona')).toBe(true);
    });

    it('Debe excluir vuelos con baja lógica', async () => {
      const expectedResult = mockVuelos.filter((v) => !v.deleted);
      (prismaService.vuelos.findMany as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.findAll({});

      expect(result).not.toContainEqual(
        expect.objectContaining({ id: '4', deleted: true }),
      );
    });

    it('Debe filtrar por múltiples criterios simultáneamente', async () => {
      const expectedResult = mockVuelos.filter(
        (v) =>
          v.origen === 'Madrid' &&
          v.estado === VuelosEstadosEnum.EN_VUELO &&
          !v.deleted,
      );
      (prismaService.vuelos.findMany as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await service.findAll({
        origen: 'Madrid',
        estado: VuelosEstadosEnum.EN_VUELO,
      });

      expect(result).toEqual(expectedResult);
      expect(result[0].origen).toBe('Madrid');
      expect(result[0].estado).toBe(VuelosEstadosEnum.EN_VUELO);
    });

    it('Debe retornar array vacío cuando no hay coincidencias', async () => {
      (prismaService.vuelos.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll({ origen: 'Lisboa' });

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});