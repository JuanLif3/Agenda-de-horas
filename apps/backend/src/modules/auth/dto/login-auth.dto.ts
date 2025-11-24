import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
    @IsEmail({}, { message: 'El email no es valido' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}