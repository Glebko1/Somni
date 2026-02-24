import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly store: DataStoreService,
    private readonly jwtService: JwtService,
  ) {}

  register(dto: RegisterDto) {
    if (this.store.users.some((u) => u.email === dto.email)) {
      throw new BadRequestException('Email already exists');
    }

    const user = {
      id: randomUUID(),
      email: dto.email,
      password: this.hash(dto.password),
      name: dto.name,
      role: 'user' as const,
      analyticsOptOut: false,
      healthSyncEnabled: true,
      consentGivenAt: new Date(),
      lastActiveAt: new Date(),
      createdAt: new Date(),
    };

    this.store.users.push(user);
    return this.issueTokenPair(user.id, user.email);
  }

  login(dto: LoginDto) {
    const user = this.store.users.find((u) => u.email === dto.email);
    if (!user || user.password !== this.hash(dto.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    user.lastActiveAt = new Date();
    return this.issueTokenPair(user.id, user.email);
  }

  refreshToken(rawRefreshToken: string) {
    const hashedRefreshToken = this.hash(rawRefreshToken);
    const user = this.store.users.find((candidate) => candidate.refreshTokenHash === hashedRefreshToken);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    user.lastActiveAt = new Date();
    return this.issueTokenPair(user.id, user.email);
  }

  private issueTokenPair(userId: string, email: string) {
    const accessToken = this.jwtService.sign({ sub: userId, email });
    const refreshToken = this.jwtService.sign(
      { sub: userId, email, type: 'refresh' },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? 'local-dev-refresh-secret',
        expiresIn: process.env.JWT_REFRESH_TTL ?? '30d',
      },
    );
    const user = this.store.users.find((candidate) => candidate.id === userId);
    if (user) {
      user.refreshTokenHash = this.hash(refreshToken);
      user.lastActiveAt = new Date();
    }

    return { accessToken, refreshToken, tokenType: 'Bearer' };
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
}
