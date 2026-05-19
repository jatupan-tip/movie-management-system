import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
    IsEmail,
    IsEnum,
    IsString,
    MinLength,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'test@test.com',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: '123456',
    })
    @MinLength(6)
    password!: string;
}