import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { API_ROUTES } from './common/constants';
import { LogService } from './common/services/log.service';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // Enable CORS
  app.enableCors();
  // Global validation pipe (inspect a requests body, validate, and trofor to dto)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Get the LogService instance from the app container
  const logService = app.get(LogService);

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(logService));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Healthcare Patient Management API')
    .setDescription('API for managing patients and their health samples with analytics capabilities')
    .setVersion('1.0')
    .addTag(API_ROUTES.PATIENTS, 'Patient management endpoints')
    .addTag(API_ROUTES.SAMPLES, 'Health sample management endpoints')
    .addTag(API_ROUTES.AUDIT, 'Request audit tracking endpoints')
    .addServer(`http://localhost:${port}`, 'Local development server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token (not enforced for this assignment)',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
