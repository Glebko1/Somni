import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CbtService } from './cbt.service';
import { CreateCbtEntryDto } from './dto/create-cbt-entry.dto';

@Controller('cbt')
@UseGuards(JwtAuthGuard)
export class CbtController {
  constructor(private readonly cbtService: CbtService) {}

  @Post('entries')
  create(@Req() req: { user: { sub: string } }, @Body() dto: CreateCbtEntryDto) {
    return this.cbtService.create(req.user.sub, dto);
  }

  @Get('entries')
  list(@Req() req: { user: { sub: string } }) {
    return this.cbtService.list(req.user.sub);
  }
}
