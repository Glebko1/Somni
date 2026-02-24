import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [JwtModule.register({ secret: 'somni-secret' })],
  controllers: [NotificationsController],
  providers: [NotificationsService, JwtAuthGuard],
  exports: [NotificationsService],
})
export class NotificationsModule {}
