import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { InsomniaController } from './insomnia.controller';
import { InsomniaService } from './insomnia.service';

@Module({
  imports: [CommonModule],
  controllers: [InsomniaController],
  providers: [InsomniaService],
})
export class InsomniaModule {}
