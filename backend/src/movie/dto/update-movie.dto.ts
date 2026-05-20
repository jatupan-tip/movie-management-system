import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsString,
    IsOptional,
    Min,
    Max,
} from 'class-validator';

export class UpdateMovieDto {
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
        example: 'PG',
    })
    @IsEnum(Rating)
    rating!: Rating;

    @IsOptional()
    @IsString()
    removeImage?: string;
}