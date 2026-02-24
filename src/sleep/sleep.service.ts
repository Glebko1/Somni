import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { CreateSleepDto } from './dto/create-sleep.dto';

@Injectable()
export class SleepService {
  constructor(private readonly store: DataStoreService) {}

  create(userId: string, dto: CreateSleepDto) {
    const efficiency = this.calculateSleepEfficiency(dto);
    const sleepWindow = this.calculateDynamicSleepWindow(userId);

    const session = {
      id: randomUUID(),
      userId,
      ...dto,
      efficiency,
      sleepWindowStart: sleepWindow.start,
      sleepWindowEnd: sleepWindow.end,
      createdAt: new Date(),
    };

    this.store.sleepSessions.push(session);
    return session;
  }

  list(userId: string) {
    return this.store.sleepSessions.filter((s) => s.userId === userId);
  }

  calculateSleepEfficiency(dto: CreateSleepDto): number {
    const totalMinutes = (new Date(dto.wakeUp).getTime() - new Date(dto.sleepStart).getTime()) / 60000;
    const interruptionPenalty = dto.interruptions * 5;
    const restorative = dto.deepSleepMinutes * 1.1 + dto.remMinutes;
    const raw = ((restorative - interruptionPenalty) / totalMinutes) * 100;
    return Math.max(0, Math.min(100, Number(raw.toFixed(2))));
  }

  calculateDynamicSleepWindow(userId: string): { start: string; end: string } {
    const sessions = this.store.sleepSessions
      .filter((s) => s.userId === userId)
      .slice(-7);

    if (sessions.length === 0) {
      return { start: '22:30', end: '06:30' };
    }

    const avgStartMinutes =
      sessions.reduce((acc, s) => acc + (s.sleepStart.getHours() * 60 + s.sleepStart.getMinutes()), 0) /
      sessions.length;
    const avgDurationMinutes =
      sessions.reduce((acc, s) => acc + (s.wakeUp.getTime() - s.sleepStart.getTime()) / 60000, 0) /
      sessions.length;

    const recommendedStart = Math.round(avgStartMinutes - 15);
    const recommendedEnd = Math.round(recommendedStart + avgDurationMinutes);

    const toHHMM = (minutes: number) => {
      const normalized = ((minutes % 1440) + 1440) % 1440;
      const hh = String(Math.floor(normalized / 60)).padStart(2, '0');
      const mm = String(normalized % 60).padStart(2, '0');
      return `${hh}:${mm}`;
    };

    return { start: toHHMM(recommendedStart), end: toHHMM(recommendedEnd) };
  }
}
