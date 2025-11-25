import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreatePetDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsOptional()
    @IsString()
    breed?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    age?: number;

    @IsOptional()
    @IsString()
    notes?: string;
}
