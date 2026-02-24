export type SomnikReaction = 'sleepy' | 'energetic' | 'sad';

export type SomnikEvolutionStage =
  | 'seed'
  | 'dreamling'
  | 'guardian'
  | 'sage'
  | 'astral';

export type SomnikSkin = {
  id: string;
  name: string;
  minRecoveryScore: number;
};

export type SleepSnapshot = {
  efficiency: number;
  consistency: number;
  recoveredMinutes: number;
  sleepDebtMinutes: number;
};

export type SomnikState = {
  stage: SomnikEvolutionStage;
  reaction: SomnikReaction;
  qualityLabel: 'poor' | 'fair' | 'good' | 'great';
  qualityScore: number;
  qualityPercent: number;
  recoveryScore: number;
  unlockedSkins: string[];
  selectedSkin: string;
  unlockedAvatars: string[];
  nextEvolutionAt: number | null;
};

export type WidgetApiPayload = {
  mascot: {
    stage: SomnikEvolutionStage;
    reaction: SomnikReaction;
    skinId: string;
  };
  sleepQuality: {
    score: number;
    percent: number;
    label: SomnikState['qualityLabel'];
    trend: 'up' | 'steady' | 'down';
  };
  recovery: {
    score: number;
    unlockedAvatars: string[];
  };
  progression: {
    nextEvolutionAt: number | null;
    unlockedSkins: string[];
  };
};

export type RewardResult = {
  recoveryScore: number;
  unlockedSkins: string[];
  unlockedAvatars: string[];
  justUnlockedSkins: string[];
  justUnlockedAvatars: string[];
};

export const SOMNIK_SKINS: SomnikSkin[] = [
  { id: 'classic', name: 'Classic Glow', minRecoveryScore: 0 },
  { id: 'aurora', name: 'Aurora Shift', minRecoveryScore: 220 },
  { id: 'sunrise', name: 'Sunrise Bloom', minRecoveryScore: 420 },
  { id: 'nebula', name: 'Nebula Pulse', minRecoveryScore: 640 }
];

const AVATAR_MILESTONE_STEP = 180;

const EVOLUTION_THRESHOLDS: Array<{ stage: SomnikEvolutionStage; minEfficiency: number }> = [
  { stage: 'seed', minEfficiency: 0 },
  { stage: 'dreamling', minEfficiency: 50 },
  { stage: 'guardian', minEfficiency: 65 },
  { stage: 'sage', minEfficiency: 78 },
  { stage: 'astral', minEfficiency: 90 }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toQualityLabel(score: number): SomnikState['qualityLabel'] {
  if (score < 40) return 'poor';
  if (score < 60) return 'fair';
  if (score < 80) return 'good';
  return 'great';
}

function toStage(efficiency: number): SomnikEvolutionStage {
  return EVOLUTION_THRESHOLDS.slice().reverse().find((entry) => efficiency >= entry.minEfficiency)?.stage ?? 'seed';
}

function nextEvolutionThreshold(efficiency: number): number | null {
  const next = EVOLUTION_THRESHOLDS.find((entry) => entry.minEfficiency > efficiency);
  return next?.minEfficiency ?? null;
}

export function deriveReaction(snapshot: SleepSnapshot): SomnikReaction {
  if (snapshot.sleepDebtMinutes >= 120 || snapshot.efficiency < 45) {
    return 'sleepy';
  }

  if (snapshot.efficiency >= 75 && snapshot.consistency >= 65 && snapshot.sleepDebtMinutes < 45) {
    return 'energetic';
  }

  return 'sad';
}

export function calculateRewards(
  previousRecoveryScore: number,
  snapshot: SleepSnapshot,
  previousUnlockedSkins: string[],
  previousUnlockedAvatars: string[]
): RewardResult {
  const recoveryGain = Math.max(0, Math.round(snapshot.recoveredMinutes * 0.7 + snapshot.efficiency * 0.3));
  const recoveryScore = previousRecoveryScore + recoveryGain;

  const unlockedSkins = SOMNIK_SKINS.filter((skin) => recoveryScore >= skin.minRecoveryScore).map((skin) => skin.id);
  const justUnlockedSkins = unlockedSkins.filter(
    (skinId) => !previousUnlockedSkins.includes(skinId)
  );

  const avatarCount = Math.floor(recoveryScore / AVATAR_MILESTONE_STEP);
  const unlockedAvatars = Array.from({ length: avatarCount }, (_, i) => `recovery-avatar-${i + 1}`);
  const justUnlockedAvatars = unlockedAvatars.filter((avatarId) => !previousUnlockedAvatars.includes(avatarId));

  return {
    recoveryScore,
    unlockedSkins,
    unlockedAvatars,
    justUnlockedSkins,
    justUnlockedAvatars
  };
}

export function deriveSomnikState(snapshot: SleepSnapshot, rewardResult: RewardResult, selectedSkin?: string): SomnikState {
  const qualityScore = Math.round(snapshot.efficiency * 0.7 + snapshot.consistency * 0.3);
  const qualityPercent = clamp(Math.round((qualityScore / 100) * 100), 0, 100);
  const reaction = deriveReaction(snapshot);
  const stage = toStage(snapshot.efficiency);

  const selected = selectedSkin && rewardResult.unlockedSkins.includes(selectedSkin) ? selectedSkin : rewardResult.unlockedSkins[0] ?? 'classic';

  return {
    stage,
    reaction,
    qualityLabel: toQualityLabel(qualityScore),
    qualityScore,
    qualityPercent,
    recoveryScore: rewardResult.recoveryScore,
    unlockedSkins: rewardResult.unlockedSkins,
    selectedSkin: selected,
    unlockedAvatars: rewardResult.unlockedAvatars,
    nextEvolutionAt: nextEvolutionThreshold(snapshot.efficiency)
  };
}

export function buildWidgetPayload(current: SomnikState, previousQualityScore: number): WidgetApiPayload {
  const trend: WidgetApiPayload['sleepQuality']['trend'] =
    current.qualityScore > previousQualityScore
      ? 'up'
      : current.qualityScore < previousQualityScore
        ? 'down'
        : 'steady';

  return {
    mascot: {
      stage: current.stage,
      reaction: current.reaction,
      skinId: current.selectedSkin
    },
    sleepQuality: {
      score: current.qualityScore,
      percent: current.qualityPercent,
      label: current.qualityLabel,
      trend
    },
    recovery: {
      score: current.recoveryScore,
      unlockedAvatars: current.unlockedAvatars
    },
    progression: {
      nextEvolutionAt: current.nextEvolutionAt,
      unlockedSkins: current.unlockedSkins
    }
  };
}

export function getAnimationPreset(reaction: SomnikReaction): {
  idleScale: number;
  idleDurationMs: number;
  bobDistance: number;
  bobDurationMs: number;
} {
  if (reaction === 'energetic') {
    return {
      idleScale: 1.08,
      idleDurationMs: 800,
      bobDistance: 8,
      bobDurationMs: 750
    };
  }

  if (reaction === 'sleepy') {
    return {
      idleScale: 0.95,
      idleDurationMs: 1900,
      bobDistance: 3,
      bobDurationMs: 1600
    };
  }

  return {
    idleScale: 1,
    idleDurationMs: 1200,
    bobDistance: 4,
    bobDurationMs: 1100
  };
}
