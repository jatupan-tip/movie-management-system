import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsString,
  Max,
  Min,
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
  @Min(1900)
  @Max(2100)
  yearReleased!: number;

  @ApiProperty({
    enum: Rating,
  })
  @IsEnum(Rating)
  rating!: Rating;
}