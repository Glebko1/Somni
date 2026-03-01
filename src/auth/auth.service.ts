import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, pbkdf2Sync, randomBytes, randomUUID, timingSafeEqual } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly passwordHashIterations = Number(process.env.PASSWORD_HASH_ITERATIONS ?? 150_000);
  private readonly passwordHashKeyLength = 64;
  private readonly passwordHashDigest = 'sha512';

  constructor(
    private readonly store: DataStoreService,
    private readonly jwtService: JwtService,
  ) {}

  register(dto: RegisterDto) {
    const normalizedEmail = this.normalizeEmail(dto.email);
    if (this.store.users.some((u) => u.email === normalizedEmail)) {
      throw new BadRequestException('Email already exists');
    }

    const passwordSalt = randomBytes(16).toString('hex');
    const user = {
      id: randomUUID(),
      email: normalizedEmail,
      password: this.hashPassword(dto.password, passwordSalt),
      passwordSalt,
      name: dto.name.trim(),
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
    const normalizedEmail = this.normalizeEmail(dto.email);
    const user = this.store.users.find((u) => u.email === normalizedEmail);

    if (!user || !this.isPasswordValid(dto.password, user.passwordSalt, user.password)) {
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
    const accessToken = this.jwtService.sign({ sub: userId, email, type: 'access' });
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

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private hashPassword(password: string, salt: string): string {
    return pbkdf2Sync(
      password,
      salt,
      this.passwordHashIterations,
      this.passwordHashKeyLength,
      this.passwordHashDigest,
    ).toString('hex');
  }

  private isPasswordValid(password: string, salt: string, expectedHash: string): boolean {
    const candidateHash = this.hashPassword(password, salt);
    const expected = Buffer.from(expectedHash, 'hex');
    const candidate = Buffer.from(candidateHash, 'hex');

    return expected.length === candidate.length && timingSafeEqual(expected, candidate);
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
}
