import { Module } from '@nestjs/common';
import { AvionesController } from './aviones.controller';
import { AvionesService } from './aviones.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AvionesController],
  providers: [AvionesService],
  exports: [AvionesService],
})
export class AvionesModule {}
