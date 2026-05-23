import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMeDto {
    @ApiProperty({
        example: 'Peter',
      })
    @IsString()
    username!: string;
}