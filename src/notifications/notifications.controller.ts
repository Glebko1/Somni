import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Req() req: { user: { sub: string } }, @Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(req.user.sub, dto);
  }

  @Get()
  list(@Req() req: { user: { sub: string } }) {
    return this.notificationsService.list(req.user.sub);
  }

  @Patch(':id/read')
  markRead(@Req() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.notificationsService.markRead(req.user.sub, id);
  }
}
