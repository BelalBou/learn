import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../shared/jwt-auth.guard';
import { User } from '../shared/user.decorator';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

class RegisterDto extends LoginDto {
  @MinLength(2)
  displayName!: string;
}

class RefreshDto {
  @IsNotEmpty()
  refreshToken!: string;
}

class RevokeDto extends RefreshDto {}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.displayName);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refresh(@User() user: any, @Body() dto: RefreshDto) {
    return this.auth.refresh(user.userId, dto.refreshToken);
  }

  @Post('revoke')
  @UseGuards(JwtAuthGuard)
  revoke(@User() user: any, @Body() dto: RevokeDto) {
    return this.auth.revoke(user.userId, dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@User() user: any) {
    return user;
  }
}
