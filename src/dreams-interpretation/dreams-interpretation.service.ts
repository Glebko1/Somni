import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { CreateDreamDto } from './dto/create-dream.dto';

@Injectable()
export class DreamsInterpretationService {
  constructor(private readonly store: DataStoreService) {}

  interpret(userId: string, dto: CreateDreamDto) {
    const text = dto.dreamText.toLowerCase();
    const tags = ['water', 'flight', 'falling', 'chase'].filter((t) => text.includes(t));
    const sentiment = text.includes('fear') || text.includes('panic') ? 'negative' : text.includes('happy') ? 'positive' : 'neutral';
    const interpretation =
      sentiment === 'negative'
        ? 'Сон указывает на накопленное напряжение. Рекомендуется вечерняя разгрузка и journaling.'
        : sentiment === 'positive'
          ? 'Сон отражает восстановление и эмоциональный ресурс.'
          : 'Сон нейтрален: мозг обрабатывает дневной опыт.';

    const entry = { id: randomUUID(), userId, dreamText: dto.dreamText, sentiment, interpretation, tags, createdAt: new Date() };
    this.store.dreams.push(entry);
    return entry;
  }

  list(userId: string) {
    return this.store.dreams.filter((d) => d.userId === userId);
  }
}
