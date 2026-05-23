import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    MovieModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(
        process.cwd(),
        'uploads',
      ),

      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule { }
