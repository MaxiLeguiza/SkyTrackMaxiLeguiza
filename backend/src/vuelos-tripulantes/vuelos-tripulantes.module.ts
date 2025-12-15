import { Module } from '@nestjs/common';
import { VuelosTripulantesService } from './vuelos-tripulantes.service';

@Module({
  providers: [VuelosTripulantesService],
  exports: [VuelosTripulantesService],
})
export class VuelosTripulantesModule {}
