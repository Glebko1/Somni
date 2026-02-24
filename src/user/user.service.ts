import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../common/data-store.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly store: DataStoreService) {}

  getProfile(userId: string) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    const { password, ...safe } = user;
    return safe;
  }

  updateProfile(userId: string, dto: UpdateUserDto) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    if (dto.name) user.name = dto.name;
    const { password, ...safe } = user;
    return safe;
  }
}
