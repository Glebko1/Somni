import { BreathSegment, FocusState, SheepAudioEvent } from './types';

export const BREATH_PATTERN: BreathSegment[] = [
  { phase: 'inhale', durationMs: 4000, cue: 'Вдох' },
  { phase: 'hold', durationMs: 4000, cue: 'Задержка' },
  { phase: 'exhale', durationMs: 6000, cue: 'Выдох' }
];

export const BREATH_CYCLE_MS = BREATH_PATTERN.reduce((sum, segment) => sum + segment.durationMs, 0);

export function resolveBreathSegment(elapsedMs: number): BreathSegment {
  const positionInCycle = elapsedMs % BREATH_CYCLE_MS;
  let acc = 0;

  for (const segment of BREATH_PATTERN) {
    acc += segment.durationMs;
    if (positionInCycle < acc) {
      return segment;
    }
  }

  return BREATH_PATTERN[BREATH_PATTERN.length - 1];
}

export function createSheepAudioEvent(sheepNumber: number): SheepAudioEvent {
  return {
    sheepNumber,
    text: `Овечка номер ${sheepNumber}. Спокойно дышим.`
  };
}

export function spawnFocusTarget(now: number): FocusState {
  return {
    score: 0,
    misses: 0,
    targetVisibleUntil: now + 3000
  };
}

export function advanceFocusState(state: FocusState, now: number): FocusState {
  if (now <= state.targetVisibleUntil) {
    return state;
  }

  return {
    ...state,
    misses: state.misses + 1,
    targetVisibleUntil: now + 3000
  };
}

export function hitFocusTarget(state: FocusState, now: number): FocusState {
  return {
    score: state.score + 1,
    misses: state.misses,
    targetVisibleUntil: now + Math.max(1200, 3000 - state.score * 60)
  };
}
