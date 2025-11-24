import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginAuthDto: LoginAuthDto) {
        const { email, password } = loginAuthDto;
        const user = await this.usersService.findOneByEmailWithPassword(email); // Buscamos el usuario en la BD (necesitamos un método que traiga el password)

        if(!user) {
            throw new UnauthorizedException('Credenciales invalidas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // Comparamos la contraseña plana con el hash de la BD

        if(!isPasswordValid) {
            throw new UnauthorizedException ('Credenciales invalidas');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            }
        };
    }
}
