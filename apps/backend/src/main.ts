/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // 1. Importar Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 2. Habilitar CORS (Permite que el frontend haga peticiones)
  app.enableCors(); 

  // 3. Configuración Global de Prefijo (/api)
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // 4. Configuración Global de Validaciones (Para que funcionen los DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina datos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían datos extra
    })
  );

  // 5. Configuración de Swagger (Documentación)
  const config = new DocumentBuilder()
    .setTitle('Pet API')
    .setDescription('Backend para gestión de clínica veterinaria')
    .setVersion('1.0')
    .addBearerAuth() // ¡Importante! Añade el botón para pegar el Token en la doc
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // La doc estará en /api/docs

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `📄 Swagger Documentation: http://localhost:${port}/${globalPrefix}/docs`
  );
}

bootstrap();