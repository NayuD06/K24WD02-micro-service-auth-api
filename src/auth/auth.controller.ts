import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Get('me')
  me(@Req() req: Request) {
    const headers = req.headers.authorization || '';
    const token = headers.startsWith('Bearer ') ? headers.substring(7) : '';
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const payload = this.jwt.verify(token);
    return { sub: payload.sub, email: payload.email, roles: payload.roles };
  }
}
