import { IsString } from 'class-validator';

export class UpdateMeDto {
    @IsString()
    username!: string;
}