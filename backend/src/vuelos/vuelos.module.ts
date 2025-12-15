import { Module } from '@nestjs/common';
import { VuelosService } from './vuelos.service';
import { VuelosController } from './vuelos.controller';
import { VuelosTripulantesModule } from '../vuelos-tripulantes/vuelos-tripulantes.module';

@Module({
  imports: [VuelosTripulantesModule],
  controllers: [VuelosController],
  providers: [VuelosService],
})
export class VuelosModule {}
