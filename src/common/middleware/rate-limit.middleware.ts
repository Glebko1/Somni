import { Injectable, NestMiddleware, TooManyRequestsException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

type Hit = { count: number; windowStart: number };

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly requests = new Map<string, Hit>();
  private readonly windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  private readonly max = Number(process.env.RATE_LIMIT_MAX ?? 120);

  use(req: Request, _res: Response, next: NextFunction) {
    const now = Date.now();
    const key = req.ip ?? 'unknown';
    const existing = this.requests.get(key);

    if (!existing || now - existing.windowStart > this.windowMs) {
      this.requests.set(key, { count: 1, windowStart: now });
      next();
      return;
    }

    existing.count += 1;
    if (existing.count > this.max) {
      throw new TooManyRequestsException('Too many requests, please retry later');
    }

    next();
  }
}
