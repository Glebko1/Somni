import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const corsWhitelist = (process.env.CORS_ORIGINS ?? 'http://localhost:8081').split(',');
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || corsWhitelist.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS blocked'));
    },
    credentials: true,
  });
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-XSS-Protection', '0');
    if (req.secure || process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  app.use('/healthz', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', uptimeSec: process.uptime() });
  });

  app.use('/readyz', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ready' });
  });
  await app.listen(3000);
}

bootstrap();
