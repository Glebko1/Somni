# Somni — Stage 1 Production-Ready MVP Architecture

## Контекст и целевые требования

Somni проектируется как **mobile-first sleep improvement platform** для пользователей с нарушениями сна (difficulty falling asleep, sleep fragmentation, poor recovery) с продуктовым ядром в виде персонального коуча **Somnik**.

Somnik — это поведенческий ИИ-ассистент, который:
- агрегирует объективные данные сна (wearables/health providers),
- собирает субъективные отчёты (дневник сна, уровень энергии, настроение),
- рассчитывает клинически релевантные метрики (sleep efficiency, sleep debt, chronotype drift),
- проводит протокол CBT-I,
- адаптирует план ограничений сна (sleep restriction / sleep window titration),
- управляет мотивацией через геймификацию,
- включает монетизацию (premium protocols, coaching),
- работает в offline-first режиме.

---

## 1) Mobile architecture (React Native + TypeScript)

### 1.1 Принципы

- **Clean Architecture + Feature-based modules**.
- UI слой максимально «тонкий», бизнес-логика в use-cases/domain services.
- Минимум перерендеров: selectors, memoization, normalized stores.
- Dark-first UI (OLED-friendly, сниженное энергопотребление).
- Lazy loading для экранов и тяжёлых фич.
- Offline-first: optimistic updates + sync queue.

### 1.2 Структура mobile-app

```text
apps/mobile
├── src
│   ├── app
│   │   ├── navigation
│   │   │   ├── RootNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   ├── MainTabsNavigator.tsx
│   │   │   └── featureStacks/
│   │   ├── providers
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── QueryProvider.tsx
│   │   │   └── SessionProvider.tsx
│   │   └── bootstrap
│   │       ├── initSentry.ts
│   │       ├── initFirebase.ts
│   │       └── initBackgroundTasks.ts
│   ├── features
│   │   ├── auth
│   │   ├── onboarding
│   │   ├── sleep-diary
│   │   ├── sleep-plan
│   │   ├── somnik-chat
│   │   ├── cbt-program
│   │   ├── gamification
│   │   ├── subscription
│   │   ├── notifications
│   │   └── settings
│   ├── entities
│   │   ├── user
│   │   ├── sleep-session
│   │   ├── sleep-metric
│   │   ├── recommendation
│   │   └── streak
│   ├── shared
│   │   ├── ui
│   │   ├── hooks
│   │   ├── lib
│   │   ├── constants
│   │   └── types
│   ├── store
│   │   ├── index.ts
│   │   ├── slices
│   │   └── selectors
│   ├── infra
│   │   ├── api
│   │   ├── db
│   │   ├── sync
│   │   └── health
│   └── index.tsx
└── package.json
```

### 1.3 Слои

- **Presentation**: RN screens/components + React Navigation + feature UI state.
- **Application**: use-cases (SubmitSleepDiary, GenerateWeeklyPlan, SyncHealthData).
- **Domain**: entities + value objects + domain rules (sleep efficiency thresholds).
- **Infrastructure**: API clients, local storage (SQLite/MMKV), Health Connect adapter, FCM client.

### 1.4 State management (Zustand)

- Store разделён на feature slices.
- Доступ к данным через selectors, чтобы избежать ненужных ререндеров.
- Тяжёлые вычисления вынесены в derived memoized selectors.
- Persist only critical state (auth/session, sync queue metadata, feature flags).

### 1.5 Навигация и lazy loading

- Root navigator решает маршрутизацию на основе auth + onboarding status.
- Feature stacks грузятся через `React.lazy`/dynamic import.
- Экраны с графиками сна и прогрессом подключают heavy chart libs только при открытии.

---

## 2) Backend architecture (NestJS + Node.js)

### 2.1 High-level

```text
[Mobile App]
   |
   v
[API Gateway (NestJS)]
   |-- Auth Module (JWT)
   |-- User/Profile Module
   |-- Sleep Data Module
   |-- CBT-I Protocol Module
   |-- Somnik Recommendation Module
   |-- Gamification Module
   |-- Billing/Stripe Module
   |-- Notification Module
   |-- Widget Feed Module
   |-- Voice Command Module
   |
   +--> PostgreSQL (Prisma)
   +--> Redis (cache + rate limit + queues)
   +--> Firebase (push)
   +--> Stripe (payments)
   +--> Health Provider Connectors
```

### 2.2 Архитектурный стиль

- **Modular monolith** для MVP (быстрый вывод на рынок), но с service boundaries, готовыми к декомпозиции.
- CQRS-lite в критичных доменах:
  - Commands: update diary, process payment webhook, update plan.
  - Queries: fetch timeline, fetch dashboard KPIs.
- Event-driven integration через Redis streams / BullMQ.

### 2.3 Core modules

1. **AuthModule** — JWT access/refresh, device sessions, revocation.
2. **UsersModule** — профиль, хронотип, timezone, settings.
3. **SleepDataModule** — intake from diary + wearables, normalization.
4. **HealthIntegrationModule** — connectors + mapping + dedup.
5. **SomnikModule** — recommendation engine, explainability payload.
6. **CbtModule** — protocol scheduling and adherence tracking.
7. **GamificationModule** — XP, levels, streaks, achievements.
8. **BillingModule** — Stripe products, subscriptions, webhooks.
9. **NotificationModule** — push campaigns, reminders, quiet hours.
10. **WidgetModule** — widget snapshot API.
11. **VoiceModule** — command parsing + secure intent execution.

### 2.4 Cross-cutting

- Global validation pipes (zod/class-validator), request tracing, structured logging.
- Rate limiting per IP + per user + per endpoint criticality.
- Feature flags for safe rollout.
- Idempotency keys for write endpoints.

---

## 3) Database schema (PostgreSQL + Prisma)

### 3.1 Сущности

```text
User
- id (uuid, pk)
- email (unique)
- password_hash
- timezone
- chronotype
- onboarding_state
- created_at, updated_at

UserSettings
- user_id (pk/fk)
- dark_mode_enabled
- notification_window_start/end
- voice_control_enabled
- widget_enabled

DeviceSession
- id
- user_id
- device_id
- refresh_token_hash
- expires_at
- revoked_at

SleepDiaryEntry
- id
- user_id
- date
- bedtime_target
- bedtime_actual
- wake_time_actual
- awakenings_count
- sleep_quality_score (1..5)
- caffeine_after_2pm (bool)
- notes

SleepSession
- id
- user_id
- source (DIARY, HEALTH_CONNECT, SAMSUNG)
- start_time
- end_time
- duration_min
- efficiency
- resting_hr
- hrv
- confidence

SleepMetricDaily
- id
- user_id
- date
- total_sleep_min
- time_in_bed_min
- sleep_efficiency
- sleep_latency_min
- waso_min
- sleep_debt_min

CbtProgram
- id
- user_id
- status (ACTIVE, PAUSED, COMPLETED)
- week_index
- sleep_window_start
- sleep_window_end
- stimulus_control_score
- restriction_adherence

Recommendation
- id
- user_id
- type (BEDTIME_SHIFT, LIGHT_EXPOSURE, CAFFEINE_CUTOFF, WIND_DOWN)
- payload_json
- generated_at
- expires_at
- accepted_at

GamificationProfile
- user_id
- xp
- level
- current_streak_days
- longest_streak_days

Achievement
- id
- code
- title
- description

UserAchievement
- id
- user_id
- achievement_id
- unlocked_at

Subscription
- id
- user_id
- stripe_customer_id
- stripe_subscription_id
- plan_code
- status
- current_period_end

PaymentEvent
- id
- provider_event_id (unique)
- type
- payload_json
- processed_at

NotificationSchedule
- id
- user_id
- type
- send_at
- channel (PUSH)
- status

WidgetSnapshot
- id
- user_id
- generated_at
- sleep_score
- tonight_window
- streak

VoiceCommandLog
- id
- user_id
- transcript
- intent
- execution_status
- created_at

SyncCursor
- id
- user_id
- provider
- cursor_value
- last_synced_at
```

### 3.2 Индексы и оптимизация

- `(user_id, date)` для daily metrics/diary.
- `(user_id, start_time)` для sleep sessions timeline.
- unique на `provider_event_id` для webhook idempotency.
- Частичные индексы на активные подписки и pending notifications.

---

## 4) Event flow

### 4.1 Общая шина событий

```text
User Action / External Trigger
   -> Command Handler
      -> DB Transaction
         -> Domain Event (outbox)
            -> Event Publisher
               -> Subscribers (Notification/Gamification/Somnik/etc.)
```

### 4.2 Ключевые сценарии

1. **User submits diary**
   - API сохраняет entry.
   - Генерирует `SleepDiarySubmitted`.
   - Recompute daily metrics.
   - Somnik module generates updated recommendation.
   - Notification module updates reminder schedule.

2. **Health sync completed**
   - Connector импортирует raw sessions.
   - Dedup + merge c diary data.
   - Генерирует `SleepDataUpdated`.
   - CbtModule проверяет adherence.

3. **Stripe webhook invoice.paid**
   - BillingModule validates signature.
   - Updates subscription state.
   - Emits `SubscriptionActivated`.
   - Feature flags for premium enabled.

---

## 5) Health integration layer

### 5.1 Абстракция провайдеров

```text
HealthProviderAdapter (interface)
- authorize(user)
- revoke(user)
- fetchSleepSessions(cursor)
- fetchBiomarkers(cursor)
- normalize(raw)
```

Реализации:
- `HealthConnectAdapter` (Google Health Connect)
- `SamsungHealthAdapter` (Samsung Health SDK/API)

### 5.2 Pipeline

```text
[Provider API]
  -> Pull Raw Data
  -> Validate Schema
  -> Normalize Units/Timezone
  -> Deduplicate
  -> Confidence Scoring
  -> Persist SleepSession
  -> Update Daily Aggregates
```

### 5.3 Разрешение конфликтов

- Приоритет по источнику и confidence score.
- Если diary явно противоречит wearable, сохраняем обе версии + merged summary.
- Explainability payload для Somnik: «почему рекомендация изменилась».

---

## 6) Gamification layer

### 6.1 Модель

- XP за ежедневные действия (дневник, соблюдение window, completion CBT tasks).
- Streak на основе подряд идущих дней с минимальным adherence threshold.
- Achievements:
  - 7-day consistency,
  - latency improvement,
  - caffeine discipline,
  - CBT week completion.

### 6.2 Anti-abuse

- XP cap/day.
- Event idempotency.
- Fraud heuristics (аномально частые edit patterns).

### 6.3 Интеграция

Геймификация не «поверх» продукта, а встроена в клинический флоу: награда за поведенческую дисциплину, а не за «клики».

---

## 7) Monetization layer (Stripe)

### 7.1 План

- Free:
  - базовый дневник,
  - ограниченный insights.
- Premium:
  - полный CBT-I протокол,
  - адаптивные рекомендации Somnik,
  - расширенная аналитика,
  - voice and widget automation.

### 7.2 Техпоток

```text
Client -> Create Checkout Session -> Stripe Hosted Checkout
      <- Success callback
Stripe Webhook -> BillingModule -> DB Subscription update
API Auth Guard + Entitlement Guard -> Feature access
```

### 7.3 Надёжность

- Все критичные изменения только по webhook (source of truth).
- Повторная обработка webhook безопасна (idempotent).

---

## 8) Widget system

### 8.1 Назначение

Home-screen widget показывает:
- Sleep score last night,
- Tonight sleep window,
- Current streak,
- Quick action (log bedtime / start wind-down).

### 8.2 Архитектура

```text
Mobile App
  -> Widget Data Service (local cache)
     -> pulls /widget/snapshot API
        -> WidgetSnapshot generation backend
```

- Backend генерирует лёгкий snapshot payload.
- Mobile сохраняет snapshot локально для offline display.
- Обновление по расписанию + после ключевых событий.

---

## 9) Voice control system

### 9.1 Команды

- «Somnik, отметь что ложусь спать»
- «Перенеси напоминание на 20 минут»
- «Покажи мой sleep score»

### 9.2 Поток

```text
Voice Input -> ASR/NLU (on-device preferred)
   -> Intent Parser
   -> Permission + risk policy check
   -> Execute command
   -> Confirm action (voice/text)
   -> Log to VoiceCommandLog
```

### 9.3 Безопасность

- Чувствительные операции требуют re-auth/biometric confirm.
- Для low-end устройств: fallback to text command shortcuts.

---

## 10) Offline-first strategy

### 10.1 Принципы

- Local-first writes (diary, tasks, habit check-ins).
- Sync queue с retry/backoff/jitter.
- Conflict policy per domain object.

### 10.2 Sync pipeline

```text
User writes locally -> mark PENDING_SYNC
   -> background sync worker
      -> API
      -> success: mark SYNCED
      -> fail: exponential backoff
```

### 10.3 Ключевые правила

- Никогда не блокировать пользователя отсутствием сети.
- UI всегда показывает freshness state (synced X min ago).
- Subscription entitlements кэшируются на ограниченное время.

---

## 11) Performance optimization strategy

### 11.1 Mobile

- Hermes enabled, Proguard/R8, minification.
- Bundle splitting/lazy screen imports.
- Avoid heavy re-render trees (memo, selector granularity).
- FlatList optimization (windowSize, getItemLayout, keyExtractor).
- Animation via Reanimated/native driver.
- Dark theme by default (OLED battery gain).
- Background jobs строго budgeted; объединение сетевых вызовов.

### 11.2 Backend

- Redis caching for dashboard endpoints.
- Pre-aggregation jobs for daily/weekly metrics.
- DB query tuning + pagination + covering indexes.
- Connection pooling and queue-based burst smoothing.

### 11.3 Battery-first подход

- Health sync по adaptive schedule (чаще утром, реже днём).
- Push-driven wakeups вместо частого polling.
- Ограничение фоновых вычислений Somnik на устройстве.

---

## 12) Security strategy

### 12.1 Auth & session

- JWT access short-lived + rotating refresh tokens.
- Device-bound sessions, revoke on suspicious activity.
- Optional biometric gate for private insights.

### 12.2 Data protection

- TLS everywhere.
- At-rest encryption for sensitive local data.
- Secret management via environment vault.
- PII minimization and data retention policies.

### 12.3 API protection

- Rate limits, WAF-compatible headers.
- Strict schema validation.
- Audit logs for sensitive events.
- Webhook signature verification (Stripe/Firebase).

### 12.4 Compliance trajectory

- MVP: consent tracking + data export/delete baseline.
- Roadmap: HIPAA/GDPR hardening depending on market.

---

## 13) Scalability strategy

### 13.1 Фазы роста

1. **MVP (0-50k MAU)**: modular monolith + Redis + Postgres read replicas.
2. **Growth (50k-500k MAU)**: выделение heavy domains:
   - Notifications service,
   - Billing service,
   - Analytics/ML pipeline.
3. **Scale (>500k MAU)**:
   - event streaming backbone,
   - per-domain storage optimization,
   - multi-region failover.

### 13.2 Наблюдаемость

- Traces (OpenTelemetry), metrics (latency, crash-free sessions, sync success rate), logs.
- SLO for core paths: auth, diary submit, recommendation generation.

---

## Как Somnik связан с данными сна

Somnik — это decision layer, связанный с sleep data через pipeline:

```text
Raw Data (Diary + Health)
   -> Normalized Sleep Model
      -> Feature Extraction
         - sleep efficiency trend
         - latency drift
         - wake regularity
         - debt accumulation
      -> Rule Engine + Personalization Model
         -> Recommendation candidates
            -> Safety + protocol constraints
               -> Final plan + explanation for user
```

Somnik использует:
- **объективные** сигналы: duration, HRV, awakenings, sleep stages (если доступны);
- **субъективные** сигналы: качество сна, дневная сонливость, настроение, adherence;
- **контекст**: часовой пояс, хронотип, рабочий график, подписка/доступные модули.

Результат Somnik всегда explainable: у каждого совета есть «какие данные повлияли» и «ожидаемый эффект».

---

## Sleep Restriction Algorithm (CBT-I core)

### Цель

Сконцентрировать сон в ограниченном окне времени в постели, чтобы повысить sleep efficiency и восстановить homeostatic sleep drive.

### Входы

- Среднее TST (total sleep time) за 7–14 дней.
- Time in bed (TIB).
- Sleep efficiency (SE = TST / TIB).
- Дневная сонливость / adverse symptoms.

### Инициализация

1. Рассчитать базовый `TST_avg`.
2. Назначить `Initial Sleep Window = max(TST_avg, 5h)` (безопасный нижний порог).
3. Якорить фиксированное время подъёма (wake anchor).
4. Bedtime = Wake anchor - Sleep Window.

### Недельная титрация

```text
If SE > 90% and daytime sleepiness acceptable:
    increase window by +15 min
Else if SE < 85%:
    decrease window by -15 min (not below safety floor)
Else:
    keep window unchanged
```

Дополнительно:
- Если выраженная дневная сонливость/риск (водители, high-risk jobs) — алгоритм conservative mode.
- При нестабильной adherence сначала фокус на stimulus control, потом дальнейшее ужесточение window.

### Критерии завершения

- Стабильный SE 85–90%+
- Клинически значимое улучшение дневного функционирования
- Устойчивый режим сна 2–4 недели

---

## Реализация CBT-I протокола в Somni

CBT-I состоит из 5 основных блоков, каждый реализуется как отдельный модуль и weekly workflow.

### 1) Sleep Education

- Микро-уроки в приложении (circadian rhythm, sleep pressure, role of consistency).
- Проверка понимания (короткие интерактивные prompts).

### 2) Stimulus Control

Правила в приложении:
- Ложиться только при сонливости.
- Если не уснул за ~20 минут — выйти из кровати.
- Кровать только для сна/секса.
- Фиксированное время подъёма.

Реализация:
- контекстные напоминания,
- voice quick commands,
- adherence tracking.

### 3) Sleep Restriction

- Автоматический расчёт sleep window (см. алгоритм выше).
- Недельный пересчёт Somnik.
- Safety overrides.

### 4) Cognitive Restructuring

- Работа с dysfunctional beliefs («я обязан спать 8 часов любой ценой»).
- Guided prompts и рефрейминг карточки.
- Отслеживание тревожных мыслей перед сном.

### 5) Relaxation & Wind-Down

- Протоколы дыхания, body scan, light stretching.
- Персонализированный pre-sleep routine.

### Оркестрация по неделям

```text
Week 0: Baseline assessment + onboarding + diary calibration
Week 1: Education + Stimulus Control (strict)
Week 2: Start Sleep Restriction window
Week 3-5: Titration + cognitive modules
Week 6: Consolidation + relapse prevention plan
```

### Метрики успеха

- Primary: Sleep efficiency, sleep latency, WASO.
- Secondary: energy, mood, adherence, perceived control.
- Product: D7/D30 retention, premium conversion, protocol completion rate.

---

## Итоговая сквозная диаграмма Somni MVP

```text
┌──────────────────────────── Mobile (React Native) ────────────────────────────┐
│ Feature UI (Diary/CBT/Somnik/Gamification/Subscription/Widget/Voice)         │
│   ↓                                                                            │
│ Zustand Store + UseCases + Offline Queue + Health Adapters                    │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │ HTTPS + JWT
┌───────────────────────────────▼───────────────────────────────────────────────┐
│                          Backend API (NestJS)                                 │
│ Auth | SleepData | Somnik | CBT | Gamification | Billing | Notification       │
│ Widget | Voice | Health Integration                                            │
│            ↓                     ↓                    ↓                         │
│        PostgreSQL            Redis Queue/Cache         External APIs            │
│                                                    Stripe / Firebase / Health  │
└────────────────────────────────────────────────────────────────────────────────┘
```

Эта архитектура даёт production-ready базу для Stage 1: клинически осмысленная логика сна, высокая мобильная производительность на low-end устройствах, монетизация, оффлайн-устойчивость и готовность к масштабированию Series A уровня.
