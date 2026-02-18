import { Module } from '@nestjs/common';
import { VuelosTripulantesService } from './vuelos-tripulantes.service';
import { VuelosTripulantesController } from './vuelos-tripulantes.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [VuelosTripulantesController],
  providers: [VuelosTripulantesService],
  exports: [VuelosTripulantesService],
})
export class VuelosTripulantesModule {}
