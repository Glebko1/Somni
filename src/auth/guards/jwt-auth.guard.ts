import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

type AccessTokenPayload = {
  sub: string;
  email: string;
  type?: 'access' | 'refresh';
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user?: { sub: string } }>();
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = auth.slice('Bearer '.length);
    try {
      const payload = this.jwtService.verify<AccessTokenPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET ?? 'local-dev-access-secret',
      });
      if (payload.type && payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      request.user = { sub: payload.sub };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
