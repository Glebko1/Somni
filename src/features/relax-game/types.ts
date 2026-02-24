export type BreathPhase = 'inhale' | 'hold' | 'exhale';

export type BreathSegment = {
  phase: BreathPhase;
  durationMs: number;
  cue: string;
};

export type SheepAudioEvent = {
  sheepNumber: number;
  text: string;
};

export type FocusState = {
  score: number;
  misses: number;
  targetVisibleUntil: number;
};

export type YoutubeAmbientPreset = {
  id: string;
  title: string;
  futureVideoId?: string;
};
