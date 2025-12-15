import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VuelosModule } from './vuelos/vuelos.module';
import { AvionesModule } from './aviones/aviones.module';
import { TripulantesModule } from './tripulantes/tripulantes.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    VuelosModule,
    AvionesModule,
    TripulantesModule,
    UsuariosModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
