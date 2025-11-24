import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsEmail({}, { message: 'El email no es valido' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsOptional()
    @IsString()
    @IsIn(['admin', 'client'])
    role?: string;
}
