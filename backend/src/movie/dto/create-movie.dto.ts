import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    example: 'Avengers',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 2020,
  })
  @Type(() => Number)
  @IsInt()
  year!: number;

  @ApiProperty({
    enum: Rating,
    example: 'PG13',
  })
  @IsEnum(Rating)
  rating!: Rating;
}