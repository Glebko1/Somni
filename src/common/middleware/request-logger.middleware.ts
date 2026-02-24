import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`);
    }
    next();
  }
}
