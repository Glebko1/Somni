import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('update')
  update(@Req() req: { user: { sub: string } }, @Body() dto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(req.user.sub, dto);
  }

  @Get('current')
  current(@Req() req: { user: { sub: string } }) {
    return this.subscriptionService.current(req.user.sub);
  }
}
