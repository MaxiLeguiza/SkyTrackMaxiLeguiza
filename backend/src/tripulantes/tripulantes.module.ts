import { Module } from '@nestjs/common';
import { TripulantesController } from './tripulantes.controller';
import { TripulantesService } from './tripulantes.service';

@Module({
  controllers: [TripulantesController],
  providers: [TripulantesService]
})
export class TripulantesModule {}
