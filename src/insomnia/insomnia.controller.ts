import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSleepLogDto } from './dto/create-sleep-log.dto';
import { TriageCheckDto } from './dto/triage-check.dto';
import { InsomniaService } from './insomnia.service';

@Controller('insomnia')
@UseGuards(JwtAuthGuard)
export class InsomniaController {
  constructor(private readonly insomniaService: InsomniaService) {}

  @Get('knowledge-model')
  getKnowledgeModel() {
    return this.insomniaService.getKnowledgeModel();
  }

  @Get('techniques')
  getTechniques() {
    return this.insomniaService.getTechniques();
  }

  @Get('education')
  getEducation() {
    return this.insomniaService.getEducationModules();
  }

  @Post('sleep-log')
  createSleepLog(@Req() req: { user: { sub: string } }, @Body() dto: CreateSleepLogDto) {
    return this.insomniaService.createSleepLog(req.user.sub, dto);
  }

  @Get('sleep-log')
  listSleepLogs(@Req() req: { user: { sub: string } }) {
    return this.insomniaService.listSleepLogs(req.user.sub);
  }

  @Get('analysis')
  getAnalysis(@Req() req: { user: { sub: string } }) {
    return this.insomniaService.getAnalysis(req.user.sub);
  }

  @Get('protocol')
  getProtocol(@Req() req: { user: { sub: string } }) {
    return this.insomniaService.getProtocol(req.user.sub);
  }

  @Get('relapse-prediction')
  getRelapsePrediction(@Req() req: { user: { sub: string } }) {
    return this.insomniaService.getRelapsePrediction(req.user.sub);
  }

  @Get('coach-payload')
  getCoachPayload(
    @Req() req: { user: { sub: string } },
    @Query('mode') mode: 'pre-sleep' | 'post-bad-night' | 'education' | 'relapse' | 'anti-catastrophizing' = 'pre-sleep',
  ) {
    return this.insomniaService.getCoachPayload(req.user.sub, mode);
  }

  @Get('social-progress')
  getSocialProgress(@Req() req: { user: { sub: string } }) {
    return this.insomniaService.getSocialProgress(req.user.sub);
  }

  @Get('saas')
  getSaasTiers() {
    return this.insomniaService.getSaasTiers();
  }

  @Get('clinical/dashboard')
  getClinicalDashboard(@Req() req: { user: { sub: string } }) {
    return this.insomniaService.getClinicalDashboard(req.user.sub);
  }

  @Post('triage/check')
  runTriage(@Req() req: { user: { sub: string } }, @Body() dto: TriageCheckDto) {
    return this.insomniaService.runTriage(req.user.sub, dto);
  }
}
