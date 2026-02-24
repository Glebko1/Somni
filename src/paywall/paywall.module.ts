import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaywallController } from './paywall.controller';
import { PaywallService } from './paywall.service';

@Module({
  imports: [JwtModule.register({ secret: 'somni-secret' })],
  controllers: [PaywallController],
  providers: [PaywallService, JwtAuthGuard],
})
export class PaywallModule {}
