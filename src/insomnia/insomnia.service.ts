import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStoreService } from '../common/data-store.service';
import { InsomniaSleepLog } from '../common/types/entities';
import { CreateSleepLogDto } from './dto/create-sleep-log.dto';
import { TriageCheckDto } from './dto/triage-check.dto';
import { EDUCATION_TOPICS, INSOMNIA_RISK_FACTORS, TECHNIQUE_LIBRARY } from './insomnia.constants';

type CoachMode = 'pre-sleep' | 'post-bad-night' | 'education' | 'relapse' | 'anti-catastrophizing';

@Injectable()
export class InsomniaService {
  constructor(private readonly store: DataStoreService) {}

  createSleepLog(userId: string, dto: CreateSleepLogDto) {
    const log: InsomniaSleepLog = {
      id: randomUUID(),
      userId,
      bedtime: new Date(dto.bedtime),
      estimatedSleepTime: new Date(dto.estimatedSleepTime),
      sleepOnsetLatency: dto.sleepOnsetLatency,
      awakeningsCount: dto.awakeningsCount,
      wakeAfterSleepOnset: dto.wakeAfterSleepOnset,
      earlyFinalAwakening: dto.earlyFinalAwakening,
      outOfBedTime: new Date(dto.outOfBedTime),
      totalSleepTime: dto.totalSleepTime,
      timeInBed: dto.timeInBed,
      sleepEfficiency: dto.sleepEfficiency,
      preSleepAnxiety: dto.preSleepAnxiety,
      daytimeSleepiness: dto.daytimeSleepiness,
      mood: dto.mood,
      caffeineAfter14: dto.caffeineAfter14,
      alcoholEvening: dto.alcoholEvening,
      exerciseTime: dto.exerciseTime,
      morningLightMinutes: dto.morningLightMinutes,
      nightUrination: dto.nightUrination,
      temperatureRoom: dto.temperatureRoom,
      deviceUseBeforeSleep: dto.deviceUseBeforeSleep,
      createdAt: new Date(),
    };

    this.store.insomniaSleepLogs.push(log);
    return log;
  }

  listSleepLogs(userId: string) {
    return this.store.insomniaSleepLogs.filter((log) => log.userId === userId);
  }

  getKnowledgeModel() {
    return {
      classification: {
        duration: ['Transient (<7 days)', 'Acute (1 week–1 month)', 'Chronic (≥3 months, ≥3 nights/week)'],
        type: ['Sleep onset (presomnic)', 'Maintenance (intrasomnic)', 'Early awakening (postsomnic)'],
        origin: ['Primary', 'Secondary (medical, psychiatric, medication-induced)'],
      },
      riskFactors: INSOMNIA_RISK_FACTORS,
    };
  }

  getTechniques() {
    return TECHNIQUE_LIBRARY;
  }

  getEducationModules() {
    return EDUCATION_TOPICS;
  }

  getProtocol(userId: string) {
    const analysis = this.getAnalysis(userId);
    const length = analysis.metrics.se < 75 || analysis.metrics.rrs > 60 ? 28 : 14;
    return {
      totalDays: length,
      levels: [
        { level: 0, name: 'Assessment (3–7 days)', focus: 'Diary completion, baseline metrics, anti-pattern discovery', days: [1, 2, 3, 4] },
        { level: 1, name: 'Behavioral Stabilization', focus: 'Wake anchor, stimulus control, sleep window, light timing', days: [5, 6, 7, 8, 9] },
        { level: 2, name: 'Cognitive Restructuring', focus: 'Catastrophizing reframing, worry container, thought diffusion', days: [10, 11, 12, 13, 14] },
        { level: 3, name: 'Autonomic Regulation', focus: 'Breathing, PMR, body scan, somatic down-regulation', days: [15, 16, 17, 18, 19, 20, 21] },
        { level: 4, name: 'Personalization & Maintenance', focus: 'Relapse prevention map, trigger planning, social consistency', days: [22, 23, 24, 25, 26, 27, 28] },
      ],
      currentLevel: this.getCurrentLevel(analysis.metrics.sri, analysis.metrics.rrs),
    };
  }

  getAnalysis(userId: string) {
    const logs = this.listSleepLogs(userId);
    const recent = logs.slice(-14);
    if (recent.length === 0) {
      return {
        metrics: { se: 0, sol: 0, waso: 0, tst: 0, sri: 0, rrs: 0 },
        insomniaSubtype: 'Insufficient data',
        durationClass: 'Unclassified',
        antiPatterns: [],
        correlations: {},
      };
    }

    const avg = (arr: number[]) => Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));
    const se = avg(recent.map((l) => l.sleepEfficiency));
    const sol = avg(recent.map((l) => l.sleepOnsetLatency));
    const waso = avg(recent.map((l) => l.wakeAfterSleepOnset));
    const tst = avg(recent.map((l) => l.totalSleepTime));
    const sri = this.computeSRI(recent);
    const rrs = this.computeRRS(recent, se, sol);

    return {
      metrics: { se, sol, waso, tst, sri, rrs },
      insomniaSubtype: this.classifyInsomniaSubtype(se, sol, waso, recent),
      durationClass: this.classifyDuration(logs.length),
      antiPatterns: this.detectAntiPatterns(recent),
      correlations: {
        caffeineVsSol: this.correlation(recent.map((l) => Number(l.caffeineAfter14)), recent.map((l) => l.sleepOnsetLatency)),
        morningLightVsSe: this.correlation(recent.map((l) => l.morningLightMinutes), recent.map((l) => l.sleepEfficiency)),
        deviceUseVsWaso: this.correlation(recent.map((l) => Number(l.deviceUseBeforeSleep)), recent.map((l) => l.wakeAfterSleepOnset)),
      },
    };
  }

  getRelapsePrediction(userId: string) {
    const analysis = this.getAnalysis(userId);
    return {
      rrs: analysis.metrics.rrs,
      riskBand: analysis.metrics.rrs >= 70 ? 'high' : analysis.metrics.rrs >= 45 ? 'moderate' : 'low',
      stabilizationProtocolTriggered: analysis.metrics.rrs >= 70,
      actions:
        analysis.metrics.rrs >= 70
          ? ['Reinforce wake anchor for 7 days', 'Reduce time in bed drift', 'Intensify level 1 + level 3 techniques', 'LLM relapse intervention mode']
          : ['Continue maintenance plan'],
    };
  }

  getCoachPayload(userId: string, mode: CoachMode) {
    const analysis = this.getAnalysis(userId);
    return {
      mode,
      promptTemplate:
        'You are Somni Coach. Provide supportive, non-diagnostic CBT-I aligned guidance. Do not prescribe medication or claim cure. Escalate to clinician when severe symptoms appear.',
      input: {
        metrics: analysis.metrics,
        insomniaType: analysis.insomniaSubtype,
        sri: analysis.metrics.sri,
        rrs: analysis.metrics.rrs,
        trendData: this.listSleepLogs(userId).slice(-7),
        currentLevel: this.getCurrentLevel(analysis.metrics.sri, analysis.metrics.rrs),
      },
      guardrails: ['No diagnosis', 'No medication instructions', 'Encourage professional help for severe symptoms'],
    };
  }

  getSocialProgress(userId: string) {
    const logs = this.listSleepLogs(userId).slice(-14);
    const first = logs.slice(0, 7);
    const second = logs.slice(7);
    const deltaSE = this.avg(second.map((l) => l.sleepEfficiency)) - this.avg(first.map((l) => l.sleepEfficiency));
    const deltaSOL = this.avg(first.map((l) => l.sleepOnsetLatency)) - this.avg(second.map((l) => l.sleepOnsetLatency));
    const streakConsistency = logs.filter((l) => l.timeInBed <= 540 && l.timeInBed >= 360).length;
    const adherence = logs.filter((l) => !l.deviceUseBeforeSleep && l.morningLightMinutes >= 10).length;
    const weeklyGrowthScore = Math.max(0, Math.min(100, Math.round(deltaSE * 1.8 + deltaSOL * 1.2 + streakConsistency * 2 + adherence * 2.5)));

    return {
      weeklyGrowthScore,
      components: { seImprovement: deltaSE, solReduction: deltaSOL, streakConsistency, protocolAdherence: adherence },
      privacyModes: ['Private', 'Progress-only sharing', 'Group challenge'],
      constraints: ['No sleep-time comparison allowed'],
    };
  }

  getSaasTiers() {
    return {
      free: ['Diary', 'Basic CBT-I'],
      premium: ['AI analysis', 'LLM coach', 'Relapse prediction', 'Social features', 'Advanced insights'],
      clinical: ['Provider dashboard', 'Multi-user monitoring', 'Data export'],
    };
  }

  getClinicalDashboard(userId: string) {
    const analysis = this.getAnalysis(userId);
    const logs = this.listSleepLogs(userId).slice(-14);
    const compliance = logs.length === 0 ? 0 : Math.round((logs.filter((l) => !l.deviceUseBeforeSleep && !l.caffeineAfter14).length / logs.length) * 100);
    const triage = this.store.triageAssessments.filter((a) => a.userId === userId).at(-1);

    return {
      kpis: {
        se: analysis.metrics.se,
        sol: analysis.metrics.sol,
        waso: analysis.metrics.waso,
        mood: this.avg(logs.map((l) => l.mood)),
        anxiety: this.avg(logs.map((l) => l.preSleepAnxiety)),
        rrs: analysis.metrics.rrs,
        sri: analysis.metrics.sri,
        compliance,
      },
      pdfExportReady: true,
      riskAlerts: triage?.referralRequired ? triage.triggers : [],
      referralRequired: triage?.referralRequired ?? false,
    };
  }

  runTriage(userId: string, dto: TriageCheckDto) {
    const analysis = this.getAnalysis(userId);
    const triggers: string[] = [];
    if (dto.phq9Score >= 20) triggers.push('PHQ-9 severe');
    if (dto.suicidalIdeation) triggers.push('Suicidal ideation');
    if (analysis.metrics.se < 60 && this.listSleepLogs(userId).slice(-14).length >= 14) triggers.push('SE < 60% for 14 days');
    if (dto.severeWorsening) triggers.push('Severe worsening');
    if (dto.apneaRisk) triggers.push('Apnea risk');

    const assessment = {
      id: randomUUID(),
      userId,
      phq9Score: dto.phq9Score,
      suicidalIdeation: dto.suicidalIdeation,
      apneaRisk: dto.apneaRisk,
      severeWorsening: Boolean(dto.severeWorsening),
      referralRequired: triggers.length > 0,
      triggers,
      createdAt: new Date(),
    };

    this.store.triageAssessments.push(assessment);
    return {
      ...assessment,
      nextStep: assessment.referralRequired
        ? 'Immediate referral screen with crisis and provider resources.'
        : 'Continue protocol with routine monitoring.',
    };
  }

  private computeSRI(logs: InsomniaSleepLog[]) {
    if (logs.length < 2) return 50;
    const startDrift = logs.slice(1).map((log, i) => Math.abs(log.bedtime.getHours() * 60 + log.bedtime.getMinutes() - (logs[i].bedtime.getHours() * 60 + logs[i].bedtime.getMinutes())));
    const outDrift = logs.slice(1).map((log, i) => Math.abs(log.outOfBedTime.getHours() * 60 + log.outOfBedTime.getMinutes() - (logs[i].outOfBedTime.getHours() * 60 + logs[i].outOfBedTime.getMinutes())));
    const drift = this.avg([...startDrift, ...outDrift]);
    return Math.max(0, Math.min(100, Number((100 - drift / 2).toFixed(2))));
  }

  private computeRRS(logs: InsomniaSleepLog[], se: number, sol: number) {
    const seDeviation = Math.max(0, 85 - se) * 1.2;
    const solSlope = this.linearSlope(logs.map((log) => log.sleepOnsetLatency)) * 2;
    const anxietyAcceleration = this.linearSlope(logs.map((log) => log.preSleepAnxiety)) * 5;
    const nonCompliance = (logs.filter((l) => l.caffeineAfter14 || l.deviceUseBeforeSleep).length / logs.length) * 30;
    return Math.max(0, Math.min(100, Number((seDeviation + Math.max(0, solSlope) + Math.max(0, anxietyAcceleration) + nonCompliance).toFixed(2))));
  }

  private classifyInsomniaSubtype(se: number, sol: number, waso: number, logs: InsomniaSleepLog[]) {
    const earlyAwakeningRate = this.avg(logs.map((l) => l.earlyFinalAwakening));
    if (sol >= 30) return 'Sleep onset (presomnic)';
    if (waso >= 45 || this.avg(logs.map((l) => l.awakeningsCount)) >= 2) return 'Maintenance (intrasomnic)';
    if (earlyAwakeningRate >= 30) return 'Early awakening (postsomnic)';
    return se < 85 ? 'Mixed insomnia features' : 'No clear insomnia subtype';
  }

  private classifyDuration(logCount: number) {
    if (logCount < 7) return 'Transient (<7 days)';
    if (logCount < 30) return 'Acute (1 week–1 month)';
    return 'Chronic (≥3 months, ≥3 nights/week)';
  }

  private detectAntiPatterns(logs: InsomniaSleepLog[]) {
    const patterns: string[] = [];
    if (this.avg(logs.map((l) => l.timeInBed)) > 540) patterns.push('Staying in bed >9h');
    if (logs.filter((l) => l.deviceUseBeforeSleep).length / logs.length > 0.3) patterns.push('Doom-scrolling at 3am');
    if (logs.filter((l) => l.caffeineAfter14).length / logs.length > 0.2) patterns.push('Going to bed earlier to compensate');
    if (logs.filter((l) => l.sleepOnsetLatency > 45 && l.preSleepAnxiety > 7).length >= 3) patterns.push('Catastrophic thinking');
    if (logs.filter((l) => l.wakeAfterSleepOnset > 45).length >= 3) patterns.push('Clock checking');
    if (logs.some((l) => l.outOfBedTime.getHours() > 9)) patterns.push('Sleeping late to recover');
    return patterns;
  }

  private correlation(x: number[], y: number[]) {
    if (x.length !== y.length || x.length < 2) return 0;
    const xMean = this.avg(x);
    const yMean = this.avg(y);
    const numerator = x.reduce((acc, xi, i) => acc + (xi - xMean) * (y[i] - yMean), 0);
    const xVar = Math.sqrt(x.reduce((acc, xi) => acc + (xi - xMean) ** 2, 0));
    const yVar = Math.sqrt(y.reduce((acc, yi) => acc + (yi - yMean) ** 2, 0));
    if (xVar === 0 || yVar === 0) return 0;
    return Number((numerator / (xVar * yVar)).toFixed(3));
  }

  private linearSlope(values: number[]) {
    if (values.length < 2) return 0;
    const n = values.length;
    const xMean = (n - 1) / 2;
    const yMean = this.avg(values);
    let num = 0;
    let den = 0;
    values.forEach((value, index) => {
      num += (index - xMean) * (value - yMean);
      den += (index - xMean) ** 2;
    });
    return den === 0 ? 0 : num / den;
  }

  private getCurrentLevel(sri: number, rrs: number) {
    if (sri < 55) return 1;
    if (rrs > 70) return 1;
    if (rrs > 45) return 3;
    return 4;
  }

  private avg(values: number[]) {
    if (values.length === 0) return 0;
    return Number((values.reduce((acc, value) => acc + value, 0) / values.length).toFixed(2));
  }
}
