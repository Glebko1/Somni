import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SleepController } from './sleep.controller';
import { SleepService } from './sleep.service';

@Module({
  imports: [JwtModule.register({ secret: 'somni-secret' })],
  controllers: [SleepController],
  providers: [SleepService, JwtAuthGuard],
  exports: [SleepService],
})
export class SleepModule {}
