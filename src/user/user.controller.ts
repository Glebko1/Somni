import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  me(@Req() req: { user: { sub: string } }) {
    return this.userService.getProfile(req.user.sub);
  }

  @Patch('me')
  update(@Req() req: { user: { sub: string } }, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.sub, dto);
  }

  @Get('me/export')
  export(@Req() req: { user: { sub: string } }) {
    return this.userService.exportData(req.user.sub);
  }

  @Post('me/consent')
  consent(@Req() req: { user: { sub: string } }, @Body() body: { consentGiven: boolean }) {
    return this.userService.updateConsent(req.user.sub, body.consentGiven);
  }

  @Post('me/health-sync')
  healthSync(@Req() req: { user: { sub: string } }, @Body() body: { enabled: boolean }) {
    return this.userService.updateHealthSync(req.user.sub, body.enabled);
  }

  @Post('me/analytics-opt-out')
  analyticsOptOut(@Req() req: { user: { sub: string } }, @Body() body: { enabled: boolean }) {
    return this.userService.updateAnalyticsOptOut(req.user.sub, body.enabled);
  }

  @Delete('me')
  delete(@Req() req: { user: { sub: string } }) {
    return this.userService.deleteMyData(req.user.sub);
  }
}
