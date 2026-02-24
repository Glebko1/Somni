import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { RewardActionDto } from './dto/reward-action.dto';

@Injectable()
export class GamificationService {
  constructor(private readonly store: DataStoreService) {}

  rewardEngine(userId: string, dto: RewardActionDto) {
    const multiplier = dto.source === 'sleep_streak' ? 1.5 : dto.source === 'cbt_progress' ? 1.3 : 1;
    const points = Math.round(dto.value * 10 * multiplier);

    const tx = { id: randomUUID(), userId, source: dto.source, points, createdAt: new Date() };
    this.store.rewardTransactions.push(tx);

    const totalPoints = this.store.rewardTransactions
      .filter((t) => t.userId === userId)
      .reduce((acc, t) => acc + t.points, 0);

    const level = Math.floor(totalPoints / 500) + 1;
    return { transaction: tx, totalPoints, level };
  }

  leaderboard() {
    const byUser = new Map<string, number>();
    for (const tx of this.store.rewardTransactions) {
      byUser.set(tx.userId, (byUser.get(tx.userId) ?? 0) + tx.points);
    }

    return [...byUser.entries()]
      .map(([userId, points]) => ({ userId, points }))
      .sort((a, b) => b.points - a.points);
  }
}
