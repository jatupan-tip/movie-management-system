import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsString,
    IsOptional,
} from 'class-validator';

export class UpdateMovieDto {
    @ApiProperty({
        example: 'Avengers',
    })
    @IsOptional()
    @IsString()
    title!: string;

    @ApiProperty({
        example: 2020,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    year!: number;

    @ApiProperty({
        enum: Rating,
        example: 'PG13',
    })
    @IsOptional()
    @IsEnum(Rating)
    rating!: Rating;
}