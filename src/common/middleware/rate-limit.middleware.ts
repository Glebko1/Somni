import { Injectable, NestMiddleware, TooManyRequestsException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

type Hit = { count: number; windowStart: number; lastSeenAt: number };

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly requests = new Map<string, Hit>();
  private readonly windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  private readonly max = Number(process.env.RATE_LIMIT_MAX ?? 120);
  private readonly maxTrackedKeys = Number(process.env.RATE_LIMIT_MAX_TRACKED_KEYS ?? 10_000);

  use(req: Request, _res: Response, next: NextFunction) {
    const now = Date.now();
    this.cleanupStaleEntries(now);

    const key = this.buildKey(req);
    const existing = this.requests.get(key);

    if (!existing || now - existing.windowStart > this.windowMs) {
      this.requests.set(key, { count: 1, windowStart: now, lastSeenAt: now });
      next();
      return;
    }

    existing.count += 1;
    existing.lastSeenAt = now;

    if (existing.count > this.max) {
      throw new TooManyRequestsException('Too many requests, please retry later');
    }

    next();
  }

  private buildKey(req: Request) {
    const rawForwarded = req.headers['x-forwarded-for'];
    const forwarded = Array.isArray(rawForwarded) ? rawForwarded[0] : rawForwarded;
    const ip = forwarded?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] ?? 'unknown';
    return `${ip}:${userAgent}`;
  }

  private cleanupStaleEntries(now: number) {
    if (this.requests.size < this.maxTrackedKeys) {
      return;
    }

    const threshold = now - this.windowMs * 2;
    for (const [key, value] of this.requests.entries()) {
      if (value.lastSeenAt < threshold) {
        this.requests.delete(key);
      }
    }
  }
}
