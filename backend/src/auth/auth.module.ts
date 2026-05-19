import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtGuard } from './jwt/jwt.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'supersecret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtGuard,
  ],
  exports: [
    JwtGuard,
    JwtModule,
  ],
})
export class AuthModule { }