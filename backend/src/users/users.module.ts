import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],

  providers: [
    UsersService,
    PrismaService,
  ],

  exports: [UsersService],

  controllers: [UsersController],
})
export class UsersModule { }