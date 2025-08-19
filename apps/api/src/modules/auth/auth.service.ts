import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await argon2.verify(user.password, password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.signUser(user.id, user.email, user.displayName);
  }

  async register(email: string, password: string, displayName: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already registered');
    const hash = await argon2.hash(password);
    const user = await this.users.create({ email, password: hash, displayName });
    return this.signUser(user.id, user.email, user.displayName);
  }

  private signUser(id: string, email: string, displayName: string) {
    const payload = { sub: id, email, displayName };
    return { accessToken: this.jwt.sign(payload) };
  }
}
