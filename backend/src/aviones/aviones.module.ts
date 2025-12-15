import { Module } from '@nestjs/common';
import { AvionesController } from './aviones.controller';
import { AvionesService } from './aviones.service';

@Module({
  controllers: [AvionesController],
  providers: [AvionesService]
})
export class AvionesModule {}
