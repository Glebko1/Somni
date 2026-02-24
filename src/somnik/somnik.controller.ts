import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AskSomnikDto } from './dto/ask-somnik.dto';
import { SomnikService } from './somnik.service';

@Controller('somnik')
@UseGuards(JwtAuthGuard)
export class SomnikController {
  constructor(private readonly somnikService: SomnikService) {}

  @Post('ask')
  ask(@Req() req: { user: { sub: string } }, @Body() dto: AskSomnikDto) {
    return this.somnikService.ask(req.user.sub, dto);
  }

  @Get('history')
  history(@Req() req: { user: { sub: string } }) {
    return this.somnikService.history(req.user.sub);
  }
}
