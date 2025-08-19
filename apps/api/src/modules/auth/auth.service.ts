import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds for access token
}

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService, private prisma: PrismaService) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await argon2.verify(user.password, password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.signUser(user.id, user.email, user.displayName, true);
  }

  async register(email: string, password: string, displayName: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already registered');
    const hash = await argon2.hash(password);
    const user = await this.users.create({ email, password: hash, displayName });
    return this.signUser(user.id, user.email, user.displayName, true);
  }

  private async createRefreshToken(userId: string) {
    const token = randomBytes(48).toString('hex');
    const tokenHash = await argon2.hash(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30d
    await this.prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
    return { token, expiresAt };
  }

  private async signUser(id: string, email: string, displayName: string, withRefresh = false): Promise<TokenPair | { accessToken: string; expiresIn: number }> {
    const payload = { sub: id, email, displayName };
    const accessToken = this.jwt.sign(payload);
    const decoded: any = this.jwt.decode(accessToken);
    const exp = decoded?.exp ? decoded.exp * 1000 : Date.now() + 1000 * 60 * 60 * 24 * 7;
    const expiresIn = Math.floor((exp - Date.now()) / 1000);
    if (!withRefresh) return { accessToken, expiresIn };
    const { token: refreshToken } = await this.createRefreshToken(id);
    return { accessToken, refreshToken, expiresIn };
  }

  async refresh(userId: string, refreshToken: string) {
    // find valid refresh tokens for user
    const tokens = await this.prisma.refreshToken.findMany({ where: { userId, revokedAt: null, expiresAt: { gt: new Date() } } });
    const match = await (async () => {
      for (const t of tokens) {
        if (await argon2.verify(t.tokenHash, refreshToken)) return t;
      }
      return null;
    })();
    if (!match) throw new ForbiddenException('Invalid refresh token');
    // rotate: revoke old, create new
    await this.prisma.refreshToken.update({ where: { id: match.id }, data: { revokedAt: new Date() } });
    const user = await this.users.findById(userId);
    if (!user) throw new ForbiddenException('User not found');
    return this.signUser(user.id, user.email, user.displayName, true);
  }

  async revoke(userId: string, refreshToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({ where: { userId, revokedAt: null } });
    for (const t of tokens) {
      if (await argon2.verify(t.tokenHash, refreshToken)) {
        await this.prisma.refreshToken.update({ where: { id: t.id }, data: { revokedAt: new Date() } });
        return { revoked: true };
      }
    }
    return { revoked: false };
  }
}
