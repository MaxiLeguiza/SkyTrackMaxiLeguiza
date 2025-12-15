import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const authService = app.get(AuthService);

  app.useGlobalGuards(new RolesGuard(reflector, authService));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});
