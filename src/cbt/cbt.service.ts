import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { CreateCbtEntryDto } from './dto/create-cbt-entry.dto';

@Injectable()
export class CbtService {
  constructor(private readonly store: DataStoreService) {}

  create(userId: string, dto: CreateCbtEntryDto) {
    const entry = { id: randomUUID(), userId, ...dto, createdAt: new Date() };
    this.store.cbtEntries.push(entry);
    return entry;
  }

  list(userId: string) {
    return this.store.cbtEntries.filter((e) => e.userId === userId);
  }
}
