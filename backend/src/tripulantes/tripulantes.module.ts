import { Module } from '@nestjs/common';
import { TripulantesController } from './tripulantes.controller';
import { TripulantesService } from './tripulantes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TripulantesController],
  providers: [TripulantesService],
  exports: [TripulantesService],
})
export class TripulantesModule {}
