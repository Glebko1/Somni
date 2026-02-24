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
      createdAt: new Date(),
    };

    this.store.users.push(user);
    return this.issueToken(user.id, user.email);
  }

  login(dto: LoginDto) {
    const user = this.store.users.find((u) => u.email === dto.email);
    if (!user || user.password !== this.hash(dto.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueToken(user.id, user.email);
  }

  private issueToken(userId: string, email: string) {
    const accessToken = this.jwtService.sign({ sub: userId, email });
    return { accessToken, tokenType: 'Bearer' };
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
}
