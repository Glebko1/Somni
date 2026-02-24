import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { AskSomnikDto } from './dto/ask-somnik.dto';

@Injectable()
export class SomnikService {
  constructor(private readonly store: DataStoreService) {}

  ask(userId: string, dto: AskSomnikDto) {
    const lower = dto.message.toLowerCase();
    const answer =
      lower.includes('stress')
        ? 'Попробуй 4-7-8 дыхание и короткую CBT запись перед сном.'
        : lower.includes('wake') || lower.includes('просып')
          ? 'Снизь свет за 90 минут до сна и стабилизируй время подъема.'
          : 'Сфокусируйся на регулярности сна: одинаковое время отхода и подъема.';

    const entry = { id: randomUUID(), userId, message: dto.message, answer, createdAt: new Date() };
    this.store.somnikConversations.push(entry);
    return entry;
  }

  history(userId: string) {
    return this.store.somnikConversations.filter((h) => h.userId === userId);
  }
}
