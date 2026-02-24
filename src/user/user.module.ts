import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [JwtModule.register({ secret: 'somni-secret' })],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard],
})
export class UserModule {}
