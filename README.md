# Somni Mobile (React Native)

Production-oriented React Native scaffold with feature-based architecture for sleep and mental wellness workflows.

## Included
- Feature modules (onboarding, sleep diary, worry dump, SOS, audio, voice, widget, health, somnik, gamification, rewards, friends, dreams, reminders, paywall)
- Zustand global store
- Axios API client with auth interceptor
- Secure storage wrapper
- Dark theme palette
- React Navigation (stack + tabs)
- Backend-connected screen services per feature

## Security baseline
- Short-lived JWT access token + refresh token rotation endpoint (`POST /auth/refresh`)
- CORS allow-list and secure HTTP headers in Nest bootstrap
- In-memory API rate limiting middleware (`RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS`)
- GDPR endpoints: export data, delete account, consent, analytics opt-out, health sync toggle
- Mobile error boundary and hardened secure storage options
