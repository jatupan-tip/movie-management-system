import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  currentPassword!: string;

  @ApiProperty({
    example: '654321',
  })
  @IsString()
  @MinLength(6)
  newPassword!: string;

  @ApiProperty({
    example: '654321',
  })
  @IsString()
  @MinLength(6)
  confirmPassword!: string;
}