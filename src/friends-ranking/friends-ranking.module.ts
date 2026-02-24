import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FriendsRankingController } from './friends-ranking.controller';
import { FriendsRankingService } from './friends-ranking.service';

@Module({
  imports: [JwtModule.register({ secret: 'somni-secret' })],
  controllers: [FriendsRankingController],
  providers: [FriendsRankingService, JwtAuthGuard],
})
export class FriendsRankingModule {}
