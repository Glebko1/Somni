import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RewardActionDto } from './dto/reward-action.dto';
import { GamificationService } from './gamification.service';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Post('reward')
  reward(@Req() req: { user: { sub: string } }, @Body() dto: RewardActionDto) {
    return this.gamificationService.rewardEngine(req.user.sub, dto);
  }

  @Get('leaderboard')
  leaderboard() {
    return this.gamificationService.leaderboard();
  }
}
