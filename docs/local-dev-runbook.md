# Local Dev Runbook (Somni)

## Repository facts verified
- Single `package.json` at repo root; no `mobile/` or `backend/` package manifests.
- No `docker-compose.yml`, `metro.config.js`, `ios/Podfile`, `android/build.gradle` in current tree.
- `prisma/schema.prisma` uses PostgreSQL and `DATABASE_URL`.
- `.env.example` includes JWT/CORS/rate-limit/mobile API base envs.

## Bootstrap commands
1. Install deps:
   ```bash
   npm install
   ```
2. Install missing backend dependencies used by `src/main.ts` and Nest modules:
   ```bash
   npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/jwt @nestjs/schedule reflect-metadata rxjs class-validator class-transformer
   npm install -D @nestjs/cli @nestjs/schematics @nestjs/testing ts-node ts-node-dev prisma @types/express
   npm install @prisma/client
   ```
3. Add backend scripts if absent (local ad-hoc):
   ```bash
   npm pkg set scripts.backend:dev="ts-node-dev --respawn --transpile-only src/main.ts"
   npm pkg set scripts.backend:start="node dist/main.js"
   npm pkg set scripts.prisma:generate="prisma generate"
   npm pkg set scripts.prisma:migrate="prisma migrate dev"
   ```
4. Copy env:
   ```bash
   cp .env.example .env.dev
   ```
5. Start PostgreSQL + Redis:
   ```bash
   docker run --name somni-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=somni -p 5432:5432 -d postgres:16
   docker run --name somni-redis -p 6379:6379 -d redis:7-alpine
   ```
6. Fill `.env.dev` minimal:
   ```dotenv
   NODE_ENV=development
   PORT=3000
   CORS_ORIGINS=http://localhost:8081,http://localhost:19006
   JWT_ACCESS_SECRET=dev-access-secret-please-replace-64-chars
   JWT_ACCESS_TTL=15m
   JWT_REFRESH_SECRET=dev-refresh-secret-please-replace-64-chars
   JWT_REFRESH_TTL=30d
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX=120
   EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/somni?schema=public
   REDIS_URL=redis://localhost:6379
   STRIPE_SECRET=sk_test_replace_me
   STRIPE_PUBLIC_KEY=pk_test_replace_me
   FIREBASE_PROJECT_ID=replace_me
   FIREBASE_API_KEY=replace_me
   ```
7. Prisma:
   ```bash
   export $(cat .env.dev | xargs)
   npx prisma generate
   npx prisma migrate dev --name init
   ```
8. Run backend:
   ```bash
   export $(cat .env.dev | xargs)
   npm run backend:dev
   ```
9. Run mobile (Expo):
   ```bash
   export $(cat .env.dev | xargs)
   npm run start
   ```
10. Generate native projects when iOS/Android folders are required:
   ```bash
   npx expo prebuild
   cd ios && pod install
   npx expo run:ios
   npx expo run:android
   ```
