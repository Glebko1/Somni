import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSleepDto } from './dto/create-sleep.dto';
import { SleepService } from './sleep.service';

@Controller('sleep')
@UseGuards(JwtAuthGuard)
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  @Post('sessions')
  create(@Req() req: { user: { sub: string } }, @Body() dto: CreateSleepDto) {
    return this.sleepService.create(req.user.sub, dto);
  }

  @Get('sessions')
  list(@Req() req: { user: { sub: string } }) {
    return this.sleepService.list(req.user.sub);
  }
}
