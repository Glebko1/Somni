import { Body, Controller, Get, Headers, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionService } from './subscription.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { StripeWebhookDto } from './dto/stripe-webhook.dto';
import { StartTrialDto } from './dto/start-trial.dto';
import { CreateB2BLicenseDto } from './dto/create-b2b-license.dto';
import { AssignB2BLicenseSeatDto } from './dto/assign-b2b-license-seat.dto';
import { TrackUsageDto } from './dto/track-usage.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('update')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: { user: { sub: string } }, @Body() dto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(req.user.sub, dto);
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  current(@Req() req: { user: { sub: string } }) {
    return this.subscriptionService.current(req.user.sub);
  }

  @Post('stripe/checkout')
  @UseGuards(JwtAuthGuard)
  stripeCheckout(@Req() req: { user: { sub: string } }, @Body() dto: CreateCheckoutDto) {
    return this.subscriptionService.createStripeCheckout(req.user.sub, dto.plan);
  }

  @Post('stripe/webhook')
  stripeWebhook(@Body() dto: StripeWebhookDto, @Headers('stripe-signature') signature?: string) {
    return this.subscriptionService.processStripeWebhook(dto, signature);
  }

  @Post('trial/start')
  @UseGuards(JwtAuthGuard)
  startTrial(@Req() req: { user: { sub: string } }, @Body() dto: StartTrialDto) {
    return this.subscriptionService.startTrial(req.user.sub, dto.days);
  }

  @Get('access/:feature')
  @UseGuards(JwtAuthGuard)
  access(@Req() req: { user: { sub: string } }, @Param('feature') feature: string) {
    return this.subscriptionService.canAccessFeature(req.user.sub, feature);
  }

  @Post('b2b/licenses')
  @UseGuards(JwtAuthGuard)
  createB2B(@Body() dto: CreateB2BLicenseDto) {
    return this.subscriptionService.createB2BLicense(dto.organizationName, dto.seats, dto.months);
  }

  @Post('b2b/licenses/:licenseId/assign-seat')
  @UseGuards(JwtAuthGuard)
  assignSeat(@Param('licenseId') licenseId: string, @Body() dto: AssignB2BLicenseSeatDto) {
    return this.subscriptionService.assignLicenseSeat(licenseId, dto.userId);
  }

  @Get('enterprise/dashboard')
  @UseGuards(JwtAuthGuard)
  enterpriseDashboard() {
    return this.subscriptionService.getEnterpriseDashboard();
  }

  @Post('usage/events')
  @UseGuards(JwtAuthGuard)
  trackUsage(@Req() req: { user: { sub: string } }, @Body() dto: TrackUsageDto) {
    return this.subscriptionService.trackUsage(req.user.sub, dto.feature, dto.action, dto.units);
  }

  @Get('usage/summary')
  @UseGuards(JwtAuthGuard)
  usageSummary(@Req() req: { user: { sub: string } }, @Query('days') days?: string) {
    const parsedDays = Number(days ?? 30);
    return this.subscriptionService.getUsageSummary(req.user.sub, Number.isFinite(parsedDays) ? parsedDays : 30);
  }
}
