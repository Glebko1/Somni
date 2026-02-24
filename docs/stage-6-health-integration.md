# Stage 6 — Health Integrations

## Providers
- Samsung Health
- Xiaomi Health
- Google Health Connect

## Synced metrics
- Heart rate
- Sleep duration
- Stress level

## Decision algorithm
If poor sleep (`< 6h`) and high stress (`>= 70/100`) are detected, Somni sends a push recommendation with a short recovery plan.

## Battery optimization
- Adaptive background schedule:
  - Morning (06:00–11:59): every 30 minutes
  - Day/Evening: every 3 hours
- Sync deduplication: repeated background runs inside minimum interval are skipped.
- Immediate sync remains available for manual user action.
