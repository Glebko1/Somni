import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [JwtModule.register({ secret: 'somni-secret' })],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, JwtAuthGuard],
})
export class SubscriptionModule {}
