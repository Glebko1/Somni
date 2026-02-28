# SOMNI Insomnia Recovery Platform Blueprint

## Backend Architecture

- **Domain module**: `src/insomnia`
  - `insomnia.controller.ts`: REST surface for diary, AI analysis, protocol, coach payload, social progression, SaaS, clinical dashboard, triage.
  - `insomnia.service.ts`: Core orchestration for insomnia classification, metrics computation, relapse scoring, anti-pattern detection, protocol sequencing, social scoring, and safety escalation.
  - `insomnia.constants.ts`: Full risk-factor index, education tracks, and complete technique library taxonomy.
  - `dto/`: strict request validation classes.
- **Shared state**: `DataStoreService` now tracks insomnia logs and triage events for analytics and clinical alerting.
- **App composition**: `InsomniaModule` is wired into `AppModule` for production API availability.

## API Routes

Base path: `/insomnia` (JWT protected).

- `GET /knowledge-model`
- `GET /techniques`
- `GET /education`
- `POST /sleep-log`
- `GET /sleep-log`
- `GET /analysis`
- `GET /protocol`
- `GET /relapse-prediction`
- `GET /coach-payload?mode=pre-sleep|post-bad-night|education|relapse|anti-catastrophizing`
- `GET /social-progress`
- `GET /saas`
- `GET /clinical/dashboard`
- `POST /triage/check`

## Data Model

### Application entities
- `InsomniaSleepLog`: complete diary schema including SOL, WASO, anxiety, circadian and behavior features.
- `InsomniaTechnique`: normalized, category-driven technique corpus with contraindications and avoidance conditions.
- `TriageAssessment`: risk assessment records including PHQ-9, suicidality, apnea risk, severe worsening and escalation triggers.

### Prisma schema additions
- `InsomniaSleepLog` table with indexed `(userId, createdAt)`.
- `TriageAssessment` table with indexed `(userId, createdAt)`.
- User model relations: `insomniaLogs`, `triageAssessments`.

## AI + Clinical Modules Implemented

- **Core computed metrics**: SE, SOL, WASO, TST, SRI, RRS.
- **Subtype classifier**: onset vs maintenance vs early awakening (with mixed fallback).
- **Duration classifier**: transient, acute, chronic mapped from history depth.
- **Correlations**: caffeine↔SOL, morning light↔SE, device use↔WASO.
- **Relapse prediction**: weighted score from SE deviation, SOL slope, anxiety acceleration, non-compliance.
- **Anti-pattern detection**: compensation bedtime drift, oversleeping, long time-in-bed, doom-scrolling, catastrophizing, clock-checking.
- **Adaptive protocol**: 14- or 28-day pathway across CBT-I levels 0–4.
- **Clinical dashboard payload**: KPIs, compliance %, risk alerts, referral flag, PDF export readiness.

## LLM Coach Prompting Contract

Prompt policy implemented in service payload:
- Required context bundle: metrics, subtype, SRI, RRS, trend data, current CBT-I level.
- Interaction modes: pre-sleep calming, post-bad-night support, educational explanation, relapse intervention, anti-catastrophizing.
- Guardrails: no diagnosis, no medication instruction, encourage professional support for severe symptoms.

## Social Logic

- Weekly Growth Score fuses:
  - SE improvement
  - SOL reduction
  - streak consistency
  - protocol adherence
- Privacy controls exposed:
  - Private
  - Progress-only sharing
  - Group challenge
- Explicit rule: no absolute sleep-time comparison.

## SaaS Gating Logic

- **Free**: Diary + Basic CBT-I
- **Premium**: AI analysis, LLM coach, relapse prediction, social, advanced insights
- **Clinical (Somni Pro)**: provider dashboard, multi-user monitoring, export

## Safety & Triage Rules

Referral pathway triggered when any condition is present:
- PHQ-9 severe
- Suicidal ideation
- SE < 60% for 14 days
- Severe worsening
- Apnea risk

Escalation output includes trigger list and referral next-step message.
