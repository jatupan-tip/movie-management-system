import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    MinLength,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'Admin',
    })
    @IsString()
    username!: string;

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