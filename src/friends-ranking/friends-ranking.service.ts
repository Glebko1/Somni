import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { AddFriendDto } from './dto/add-friend.dto';

@Injectable()
export class FriendsRankingService {
  constructor(private readonly store: DataStoreService) {}

  addFriend(userId: string, dto: AddFriendDto) {
    if (userId === dto.friendId) throw new BadRequestException('Cannot add yourself');
    const friendExists = this.store.users.some((u) => u.id === dto.friendId);
    if (!friendExists) throw new BadRequestException('Friend does not exist');

    const existing = this.store.friendships.find((f) => f.userId === userId && f.friendId === dto.friendId);
    if (existing) return existing;

    const friendship = { id: randomUUID(), userId, friendId: dto.friendId, createdAt: new Date() };
    this.store.friendships.push(friendship);
    return friendship;
  }

  ranking(userId: string) {
    const ids = new Set([
      userId,
      ...this.store.friendships.filter((f) => f.userId === userId).map((f) => f.friendId),
    ]);

    return [...ids]
      .map((id) => ({
        userId: id,
        points: this.store.rewardTransactions.filter((r) => r.userId === id).reduce((a, b) => a + b.points, 0),
      }))
      .sort((a, b) => b.points - a.points);
  }
}
