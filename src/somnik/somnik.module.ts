import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SomnikController } from './somnik.controller';
import { SomnikService } from './somnik.service';

@Module({
  imports: [JwtModule.register({ secret: 'somni-secret' })],
  controllers: [SomnikController],
  providers: [SomnikService, JwtAuthGuard],
})
export class SomnikModule {}
