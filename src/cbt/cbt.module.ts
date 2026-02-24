import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CbtController } from './cbt.controller';
import { CbtService } from './cbt.service';

@Module({
  imports: [JwtModule.register({ secret: 'somni-secret' })],
  controllers: [CbtController],
  providers: [CbtService, JwtAuthGuard],
})
export class CbtModule {}
