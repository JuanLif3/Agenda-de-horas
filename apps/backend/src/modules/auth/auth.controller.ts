import { Controller, Body, Post, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() loginAuthDto: LoginAuthDto) {
        return this.authService.login(loginAuthDto);
    }
    // --- NUEVA RUTA PROTEGIDA ---
    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Req() req: Request) {
        return req.user;
    }
}

