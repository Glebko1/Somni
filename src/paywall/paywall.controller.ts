import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TrackPaywallDto } from './dto/track-paywall.dto';
import { PaywallService } from './paywall.service';

@Controller('paywall')
@UseGuards(JwtAuthGuard)
export class PaywallController {
  constructor(private readonly paywallService: PaywallService) {}

  @Get()
  payload(@Req() req: { user: { sub: string } }) {
    return this.paywallService.getPaywall(req.user.sub);
  }

  @Post('track')
  track(@Req() req: { user: { sub: string } }, @Body() dto: TrackPaywallDto) {
    return this.paywallService.trackImpression(req.user.sub, dto.variant, dto.converted);
  }
}
