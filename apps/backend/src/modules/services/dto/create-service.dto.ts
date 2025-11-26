import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del servicio es obligatorio' })
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @Min(5, { message: 'La duracion minima debe ser de 5 minutos' })
    duration: number;

    @IsInt()
    @Min(0, { message: 'El precio no puede ser negativo' })
    price: number;
}
