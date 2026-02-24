import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly store: DataStoreService) {}

  create(userId: string, dto: CreateNotificationDto) {
    const notification = {
      id: randomUUID(),
      userId,
      title: dto.title,
      message: dto.message,
      read: false,
      scheduledAt: dto.scheduledAt ?? new Date(),
      createdAt: new Date(),
    };
    this.store.notifications.push(notification);
    return notification;
  }

  list(userId: string) {
    return this.store.notifications.filter((n) => n.userId === userId);
  }

  markRead(userId: string, id: string) {
    const notification = this.store.notifications.find((n) => n.id === id && n.userId === userId);
    if (!notification) throw new NotFoundException('Notification not found');
    notification.read = true;
    return notification;
  }
}
