import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DreamsInterpretationController } from './dreams-interpretation.controller';
import { DreamsInterpretationService } from './dreams-interpretation.service';

@Module({
  imports: [JwtModule.register({ secret: 'somni-secret' })],
  controllers: [DreamsInterpretationController],
  providers: [DreamsInterpretationService, JwtAuthGuard],
})
export class DreamsInterpretationModule {}
