import { BadRequestException } from '@nestjs/common';

const REQUIRED_IN_PRODUCTION = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'STRIPE_WEBHOOK_SECRET'] as const;

export function validateEnvironment() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const missing = REQUIRED_IN_PRODUCTION.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new BadRequestException(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
