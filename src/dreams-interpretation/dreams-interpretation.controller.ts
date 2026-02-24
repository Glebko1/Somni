import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDreamDto } from './dto/create-dream.dto';
import { DreamsInterpretationService } from './dreams-interpretation.service';

@Controller('dreams')
@UseGuards(JwtAuthGuard)
export class DreamsInterpretationController {
  constructor(private readonly dreamsService: DreamsInterpretationService) {}

  @Post('interpret')
  interpret(@Req() req: { user: { sub: string } }, @Body() dto: CreateDreamDto) {
    return this.dreamsService.interpret(req.user.sub, dto);
  }

  @Get()
  list(@Req() req: { user: { sub: string } }) {
    return this.dreamsService.list(req.user.sub);
  }
}
