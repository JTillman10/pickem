import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiPrefix } from './config';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  await app.listen(3000);
}
bootstrap();
