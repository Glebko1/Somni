import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';

@Module({
  imports: [JwtModule.register({ secret: 'somni-secret' })],
  controllers: [GamificationController],
  providers: [GamificationService, JwtAuthGuard],
})
export class GamificationModule {}
