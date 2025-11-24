import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../modules/users/users.module';
import { AuthModule } from '../modules/auth/auth.module';
@Module({
  imports: [
    // 1. ConfigModule para leer el archivo .env
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables estén disponibles en todo el proyecto
    }),

    // 2. TypeOrmModule para conectar a Neon
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Lee la URL del .env
      autoLoadEntities: true, // Carga automáticamente las entidades que crees
      synchronize: true, // ¡IMPORTANTE!: En Prod esto va en false. En Dev (true) crea tablas automáticamente.
      ssl: true, // Neon requiere SSL
      extra: {
        ssl: {
          rejectUnauthorized: false, // Necesario para algunas conexiones seguras de Neon
        },
      },
    }),

    UsersModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
