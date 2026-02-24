# Stage 8 — Optimization

## Implemented capabilities

- **Minimal runtime bundle pressure**:
  - moved feature screen imports in navigators to `React.lazy` dynamic imports,
  - reduced startup work by not loading every screen module upfront.
- **Lazy loading**:
  - stack and tab feature screens are lazy-loaded,
  - bottom tabs now explicitly use lazy route mounting.
- **Background task optimization**:
  - health background sync interval remains adaptive by time-of-day,
  - low-end mode now increases sync interval to reduce wakeups.
- **Minimal battery drain**:
  - `freezeOnBlur` added for stack and tabs to pause off-screen trees,
  - background sync keeps adaptive intervals and skip logic.
- **Low-end device mode**:
  - bootstrap detects legacy Android devices and stores mode in global state,
  - health sync engine receives low-end mode and applies less frequent schedule.
- **No unnecessary renders**:
  - `SomnikAnimated` wrapped with `memo`,
  - sleep quality progress value is clamped and memoized before render.
- **Bundle splitting**:
  - route-level splitting in `RootNavigator` and `MainTabs` with dynamic `import()`.
